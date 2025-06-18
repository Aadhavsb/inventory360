import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory360 - Wildlife SOS Asset Management",
  description: "Conservation asset management system for Wildlife SOS rescue centers across India. Track medical supplies, equipment, and resources for wildlife care.",
  keywords: ["Wildlife SOS", "Asset Management", "Conservation", "Inventory", "Wildlife Rescue"],
  authors: [{ name: "Wildlife SOS" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2D5A27",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
