import type { Platform } from "@/types";

export interface PublishPayload {
  videoUrl: string;
  title: string;
  description: string;
  hashtags: string[];
  accessToken: string;
}

export interface PublishResult {
  success: boolean;
  platformId?: string;
  error?: string;
}

export interface PlatformAdapter {
  platform: Platform;
  publish(payload: PublishPayload): Promise<PublishResult>;
  validateToken(accessToken: string): Promise<boolean>;
}
