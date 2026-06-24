import type { PlatformAdapter, PublishPayload, PublishResult } from "../platforms/types";

export class TikTokAdapter implements PlatformAdapter {
  platform = "tiktok" as const;

  async publish(payload: PublishPayload): Promise<PublishResult> {
    try {
      const caption = `${payload.title}\n\n${payload.description}\n\n${payload.hashtags.join(" ")}`;

      const response = await fetch(
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${payload.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_info: {
              title: payload.title,
              description: caption,
              privacy_level: "PUBLIC_TO_EVERYONE",
              disable_duet: false,
              disable_comment: false,
              disable_stitch: false,
            },
            source_info: {
              source: "PULL_FROM_URL",
              video_url: payload.videoUrl,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `TikTok API error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        platformId: data.data?.publish_id ?? "pending",
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "TikTok publish failed",
      };
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const tiktokAdapter = new TikTokAdapter();
