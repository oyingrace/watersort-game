"use client";

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function ClientFrameReady() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      try { setFrameReady(); } catch {}
    }
  }, [isFrameReady, setFrameReady]);

  return null;
}


