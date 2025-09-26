import { useEffect, useMemo } from 'react';
import { useMiniKit, useIsInMiniApp } from '@coinbase/onchainkit/minikit';
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

export function useFarcasterProfile(): { profile: FarcasterProfile; address?: string } {
  const { context, isFrameReady, setFrameReady } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();
  const { address } = useAccount();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const profile = useMemo<FarcasterProfile>(() => {
    if (!isInMiniApp || !context?.user) return {};
    const u = context.user as any;
    const maybePfp = u.pfpUrl ?? u.pfp ?? u.profile?.pfp ?? u.profile?.picture;
    return {
      fid: u.fid,
      username: u.username ?? u.profile?.username,
      displayName: u.displayName ?? u.profile?.displayName ?? u.profile?.name,
      pfpUrl: pickUrl(maybePfp),
    };
  }, [isInMiniApp, context?.user]);

  // Debug logging for Mini App detection and profile extraction
  useEffect(() => {
    try {
      // Keep logs concise to avoid leaking sensitive data
      console.debug('[MiniApp] isInMiniApp:', isInMiniApp);
      console.debug('[MiniApp] hasContextUser:', Boolean(context?.user));
      console.debug('[MiniApp] derived fid:', (profile as any)?.fid);
      console.debug('[Wallet] address present:', Boolean(address));
    } catch {}
  }, [isInMiniApp, context?.user, (profile as any)?.fid, address]);

  return { profile, address };
}


