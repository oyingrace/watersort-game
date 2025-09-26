"use client";

import { useEffect, useState } from 'react';
import { useFarcasterProfile } from '@/lib/useFarcasterProfile';
import { useIsInMiniApp, useMiniKit } from '@coinbase/onchainkit/minikit';

export default function DebugMiniApp() {
  const { profile, address } = useFarcasterProfile();
  const { isInMiniApp } = useIsInMiniApp();
  const { isFrameReady } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      isInMiniApp,
      isFrameReady,
      fid: (profile as any)?.fid,
      username: (profile as any)?.username,
      pfpUrl: (profile as any)?.pfpUrl,
      address,
      origin: typeof window !== 'undefined' ? window.location.origin : 'n/a',
      envUrl: process.env.NEXT_PUBLIC_URL || 'n/a',
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
      timestamp: new Date().toLocaleTimeString()
    };
    setDebugInfo(info);
    
    try {
      console.debug('[DebugMiniApp]', info);
    } catch {}
  }, [isInMiniApp, (profile as any)?.fid, (profile as any)?.username, (profile as any)?.pfpUrl, address]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white p-2 text-xs z-50 font-mono">
      <div className="max-w-md mx-auto">
        <div className="font-bold mb-1">🔍 Mini App Debug</div>
        <div>In Mini App: {debugInfo.isInMiniApp ? '✅' : '❌'}</div>
        <div>Frame Ready: {debugInfo.isFrameReady ? '✅' : '❌'}</div>
        <div>FID: {debugInfo.fid || 'none'}</div>
        <div>Username: {debugInfo.username || 'none'}</div>
        <div>Address: {debugInfo.address ? `${debugInfo.address.slice(0, 6)}...${debugInfo.address.slice(-4)}` : 'none'}</div>
        <div>PFP: {debugInfo.pfpUrl ? '✅' : '❌'}</div>
        <div>Origin: {debugInfo.origin}</div>
        <div>Env URL: {debugInfo.envUrl}</div>
        <div>UA: {debugInfo.ua}</div>
        <div>Updated: {debugInfo.timestamp}</div>
      </div>
    </div>
  );
}


