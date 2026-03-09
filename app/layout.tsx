import type { Metadata, Viewport } from "next";
import "./globals.css";
import SparkleProvider from "@/components/Sparkleprovider";
import SettingsProvider from "@/components/Settingsprovider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "4th November - Visual Novel Game",
  description:
    "An interactive visual novel game experience. Login with Google, customize your character, and unravel the story.",
  icons: {
    icon: "/favicon.ico",
  },
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
          {children}
        </SettingsProvider>
        <SparkleProvider />
      </body>
    </html>
  );
}