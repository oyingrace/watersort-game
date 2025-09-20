"use client";

import BottomNav from "./components/BottomNav";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";

export default function Home() {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  return (
    <div className="min-h-screen bg-blue-500 pt-24">
      <BottomNav />
    </div>
  );
}
