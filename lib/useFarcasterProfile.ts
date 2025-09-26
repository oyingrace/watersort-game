import { useEffect, useMemo, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';

export type FarcasterProfile = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

function pickUrl(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const keys = ['url', 'src', 'srcUrl', 'original', 'default', 'small', 'medium', 'large'];
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === 'string') return v;
    }
  }
  return undefined;
}

export type MiniAppPlatformType = 'web' | 'mobile';

export type MiniAppLocationContext = {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  cityName?: string;
};

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type MiniAppNotificationDetails = {
  token: string;
  url: string;
};

export type MiniAppContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: MiniAppLocationContext;
  client: {
    platformType?: MiniAppPlatformType;
    clientFid: number;
    added: boolean;
    safeAreaInsets?: SafeAreaInsets;
    notificationDetails?: MiniAppNotificationDetails;
  };
  features?: {
    haptics: boolean;
    cameraAndMicrophoneAccess?: boolean;
  };
};

export function useFarcasterProfile(): { profile: FarcasterProfile; address?: string; isInMiniApp: boolean; context: MiniAppContext | null } {
  const { address } = useAccount();
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isFrameReady, setIsFrameReady] = useState(false);

  // Initialize the Farcaster SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Call actions.ready() like zerox does
        await sdk.actions.ready();

        // Check environment for Mini App features
        const isEmbedded = window.self !== window.top;
        const isCastDev = window.location.href.includes('dev.cast.app');
        const isWarpcast = window.location.href.includes('warpcast.com');

        const isFrameEnv = isEmbedded || isCastDev || isWarpcast;
        setIsInMiniApp(isFrameEnv);
        setIsFrameReady(true);

        console.debug('[FarcasterSDK] SDK ready, checking environment');
        console.debug('[FarcasterSDK] SDK methods available:', Object.keys(sdk));
        
        // Try to get the real context from the SDK
        await fetchUserDataFromSDK();
      } catch (error) {
        console.debug('[FarcasterSDK] SDK ready failed:', error);
        setIsInMiniApp(false);
        setIsFrameReady(false);
      }
    };

    const fetchUserDataFromSDK = async () => {
      try {
        // Try the SDK APIs sequentially
        console.debug('[FarcasterSDK] Attempting to fetch user data...');
        
        // This will determine which SDK method actually works 
        const methods = [
          // sd.actions methods
          async () => {
            let context;
            try { context = await (sdk as any).actions.getContext?.(); } catch { return null; }
            return context;
          },
          // direct sdk properties
          () => sdk.context,
          () => (sdk as any).context,
          // global checks
          () => {
            const globalData = (window as any).miniapp?.context || 
                             (window as any).MiniApp?.context ||
                             (window as any).__farcaster_mini_context;
            return globalData;
          },
          () => {
            const userData = (window as any).user || (window as any).miniapp?.user || (window as any).miniapp?.data;
            if (userData && userData.fid) {
              const standardized: MiniAppContext = {
                user: { 
                  fid: userData.fid,
                  username: userData.username || userData.display_name || '',
                  displayName: userData.displayName || userData.display_name || '',
                  pfpUrl: userData.pfp || userData.pfp_url || userData.pfpUrl
                },
                client: {
                  platformType: 'web' as MiniAppPlatformType,
                  clientFid: userData.fid,
                  added: true 
                }
              };
              return standardized;
            }
          }
        ];
        
        const attemptedContexts = [];
        
        for (let index = 0; index < methods.length; index++) {
          try {
            const result = await methods[index]();
            if (result && result.user) {
              console.debug('[FarcasterSDK] Successfully got context with method ', index, result);
              setContext(result);
              return;
            }
            attemptedContexts.push({ methodName: 'method_' + index, result });
          } catch (e) {
            const errorMessage = e && typeof e === 'object' && 'message' in e ? e.message : String(e);
            console.debug('[FarcasterSDK] Method', index, 'failed:', e);
            attemptedContexts.push({ methodName: 'method_' + index, error: errorMessage });
          }
        }
        
        console.debug('[FarcasterSDK] All SDK methods failed. Attempted:', attemptedContexts);
        throw new Error('All SDK user methods failed');
        
      } catch (fetchError) {
        console.debug('[FarcasterSDK] Failed to fetch user data:', fetchError);
        
        // Set up a listener for context changes since the data might arrive asynchronously
        // This is crucial in a MiniApp environment where data may not be immediately available
        const checkForContextCallback = () => {
          const windowData = (window as any);
          const possibleFlatContexts = [
            windowData.user || windowData.miniapp?.user || windowData.MiniApp?.user,
            windowData.context || windowData.miniapp?.context || windowData.MiniApp?.context,
            windowData.farcasterContext || windowData.__farcaster_mini_context
          ].filter(Boolean);
          
          if (possibleFlatContexts.length > 0) {
            const rawContext = possibleFlatContexts[0];
            if (rawContext && (rawContext.fid || rawContext.user)) {
              console.debug('[FarcasterSDK] Found global user data:', rawContext);
              if (rawContext.user) {
                setContext(rawContext);
                return;
              } else if (rawContext.fid && rawContext.username) {
                const constructedContext: MiniAppContext = {
                  user: { 
                    fid: rawContext.fid,
                    username: rawContext.username,
                    displayName: rawContext.display_name || rawContext.displayName,
                    pfpUrl: rawContext.pfp || rawContext.pfp_url || rawContext.pfpUrl
                  },
                  client: {
                    platformType: 'web' as MiniAppPlatformType,
                    clientFid: rawContext.fid,
                    added: true 
                  }
                };
                setContext(constructedContext);
                return;
              }
            }
          }
          
          setContext({
            user: { fid: Date.now(), username: 'user', displayName: 'User', pfpUrl: '' },
            client: { platformType: 'web' as MiniAppPlatformType, clientFid: Date.now(), added: true }
          });
        };
        
        // Check immediately then setup polling
        checkForContextCallback();
        const pollInterval = setInterval(checkForContextCallback, 500);
        setTimeout(() => clearInterval(pollInterval), 10000); // Stop polling after 10 seconds
      }
    };

    initializeSDK();
  }, []);

  const profile = useMemo<FarcasterProfile>(() => {
    if (!context?.user) return {};
    
    return {
      fid: context.user.fid,
      username: context.user.username,
      displayName: context.user.displayName,
      pfpUrl: context.user.pfpUrl,
    };
  }, [context?.user]);

  // Debug logging
  useEffect(() => {
    console.debug('[MiniApp] isInMiniApp:', isInMiniApp);
    console.debug('[MiniApp] hasContextUser:', Boolean(context?.user));
    console.debug('[MiniApp] derived fid:', profile.fid);
    console.debug('[Wallet] address present:', Boolean(address));
    console.debug('[MiniApp] context:', context);
  }, [isInMiniApp, context, profile.fid, address]);

  return { profile, address, isInMiniApp, context };
}


