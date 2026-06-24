import type { PlatformAdapter, PublishPayload, PublishResult } from "../platforms/types";

export class YouTubeAdapter implements PlatformAdapter {
  platform = "youtube" as const;

  async publish(payload: PublishPayload): Promise<PublishResult> {
    try {
      const tags = payload.hashtags.map((h) => h.replace(/^#/, ""));

      const response = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${payload.accessToken}`,
            "Content-Type": "application/json",
            "X-Upload-Content-Type": "video/*",
          },
          body: JSON.stringify({
            snippet: {
              title: payload.title,
              description: `${payload.description}\n\n${payload.hashtags.join(" ")}`,
              tags,
              categoryId: "22",
            },
            status: {
              privacyStatus: "public",
              selfDeclaredMadeForKids: false,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `YouTube API error: ${error}` };
      }

      const data = await response.json();
      return { success: true, platformId: data.id };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "YouTube publish failed",
      };
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
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

export const youtubeAdapter = new YouTubeAdapter();
