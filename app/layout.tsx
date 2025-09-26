import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import ClientFrameReady from "./ready";
import BootstrapIdentity from "./components/BootstrapIdentity";
import DebugMiniApp from "./components/DebugMiniApp";

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: "Color-Water Sort Game",
    description:
      "A water color sort game",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_PROJECT_NAME,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor:
              process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}


// Suppress hydration warnings from browser extensions 
const suppressHydrationWarning = process.env.NODE_ENV === 'development';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={suppressHydrationWarning}>
        <Providers>
          <ClientFrameReady />
          <DebugMiniApp />
         {/*  <BootstrapIdentity /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
