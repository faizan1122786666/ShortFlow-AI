import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "ShortFlow AI | Schedule Short-Form Videos",
  description:
    "Upload, schedule, and publish short-form videos to YouTube Shorts and TikTok with AI-powered metadata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
