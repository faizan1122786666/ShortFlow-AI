import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Platform, VideoStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export function getPlatformLabel(platform: Platform | string): string {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    tiktok: "TikTok",
  }

  return labels[platform] ?? platform
}

export function getStatusColor(status: VideoStatus | string): string {
  const colors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground border-border",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    publishing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    failed: "bg-destructive/20 text-destructive border-destructive/30",
  }

  return colors[status] ?? colors.draft
}
