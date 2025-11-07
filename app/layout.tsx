import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "損益分岐点&加算効果シミュレータ",
  description: "生活介護サービス費検索システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} antialiased bg-gray-100`}
        style={{ fontFamily: "var(--font-noto-sans-jp), var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif" }}
      >
        <AppProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
