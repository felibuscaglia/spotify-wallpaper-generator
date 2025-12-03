import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "@/components/feedback-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Wallpaper Generator | Turn Playlists Into Art",
  description: "Create stunning wallpapers from your Spotify playlists. Customize fonts, colors, and layouts for your phone, tablet, or desktop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FeedbackWidget variant="floating" position="bottom-right" />
      </body>
    </html>
  );
}
