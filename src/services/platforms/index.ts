import type { Platform } from "@/types";
import { youtubeAdapter } from "@/services/youtube";
import { tiktokAdapter } from "@/services/tiktok";
import type { PlatformAdapter } from "./types";

const adapters: Record<Platform, PlatformAdapter> = {
  youtube: youtubeAdapter,
  tiktok: tiktokAdapter,
};

export function getPlatformAdapter(platform: Platform): PlatformAdapter {
  return adapters[platform];
}

export { youtubeAdapter, tiktokAdapter };
export type { PlatformAdapter, PublishPayload, PublishResult } from "./types";
