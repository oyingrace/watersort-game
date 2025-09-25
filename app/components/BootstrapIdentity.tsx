"use client";

import { useEffect } from 'react';
import { useFarcasterProfile } from '@/lib/useFarcasterProfile';
import { useAccount } from 'wagmi';

export default function BootstrapIdentity() {
  const { profile, address } = useFarcasterProfile();
  const { address: wagmiAddress } = useAccount();

  const addr = address || wagmiAddress || undefined;
  const fid = profile.fid;
  const username = profile.username;
  const pfpUrl = profile.pfpUrl;

  useEffect(() => {
    if (!addr && !fid) return;
    const payload = JSON.stringify({ address: addr, fid, username, pfpUrl });
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/user/upsert', blob);
    } else {
      fetch('/api/user/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [addr, fid, username, pfpUrl]);

  return null;
}


