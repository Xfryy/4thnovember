import type { Metadata, Viewport } from "next";
import "./globals.css";
import SparkleProvider from "@/components/Sparkleprovider";
import SettingsProvider from "@/components/Settingsprovider";
import LandscapeGuard from "@/components/Landscapeguard"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "4th November - Visual Novel Game",
  description:
    "An interactive visual novel game experience. Login with Google, customize your character, and unravel the story.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ]
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-dark text-white">
        {/*
          SettingsProvider:
          - Applies brightness via CSS filter
          - Syncs volume sliders to Web Audio API (audioManager)
          - Sets --text-speed-ms CSS variable for dialogue typewriter
        */}
        <SettingsProvider>
          <LandscapeGuard>
            {children}
          </LandscapeGuard>
        </SettingsProvider>
                <SparkleProvider />
                <SpeedInsights/>
              </body>
            </html>
          );
        }
        