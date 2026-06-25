import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
