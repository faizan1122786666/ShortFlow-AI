import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerPublishWorkflow } from "@/services/n8n";
import type { Platform } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { videoId, platforms } = body as {
      videoId: string;
      platforms: Platform[];
    };

    if (!videoId || !platforms?.length) {
      return NextResponse.json(
        { error: "videoId and platforms required" },
        { status: 400 }
      );
    }

    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("*")
      .eq("id", videoId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.status === "published") {
      return NextResponse.json(
        { error: "Video is already published" },
        { status: 400 }
      );
    }

    if (video.status === "scheduled" && video.scheduled_at) {
      const scheduledAt = new Date(video.scheduled_at).getTime();
      if (scheduledAt > Date.now()) {
        return NextResponse.json(
          {
            error:
              "This video is scheduled for later. Scheduled uploads are handled by the cron workflow, not /api/publish.",
          },
          { status: 400 }
        );
      }
    }

    const n8nResult = await triggerPublishWorkflow({
      videoId,
      userId: user.id,
      videoUrl: video.video_url,
      title: video.title ?? "Untitled",
      description: video.description ?? "",
      hashtags: video.hashtags ?? [],
      platforms,
    });

    if (!n8nResult.success) {
      return NextResponse.json(
        { error: n8nResult.error ?? "Failed to trigger publish workflow" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoId,
      n8nTriggered: true,
    });
  } catch (err) {
    console.error("Publish failed:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Publish failed",
      },
      { status: 500 }
    );
  }
}
