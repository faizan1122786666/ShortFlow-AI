export type VideoStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed";

export type Platform = "youtube" | "tiktok";

export type PublishStatus = "pending" | "success" | "failed";

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  video_url: string;
  title: string | null;
  description: string | null;
  hashtags: string[] | null;
  platforms: Platform[];
  scheduled_at: string | null;
  status: VideoStatus;
  created_at: string;
}

export interface PlatformConnection {
  id: string;
  user_id: string;
  platform: Platform;
  access_token: string;
  refresh_token: string | null;
  created_at: string;
}

export interface PublishHistory {
  id: string;
  video_id: string;
  platform: Platform;
  status: PublishStatus;
  published_at: string | null;
}

export interface GenerateMetadataRequest {
  type: "title" | "description" | "hashtags" | "all";
  context?: string;
  videoId?: string;
}

export interface GenerateMetadataResponse {
  title?: string;
  description?: string;
  hashtags?: string[];
}

export interface PublishRequest {
  videoId: string;
  platforms: Platform[];
}
