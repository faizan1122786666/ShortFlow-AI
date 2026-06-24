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

    const { error: updateError } = await supabase
      .from("videos")
      .update({ status: "scheduled", platforms })
      .eq("id", videoId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    for (const platform of platforms) {
      await supabase.from("publish_history").upsert({
        video_id: videoId,
        platform,
        status: "pending",
      }, { onConflict: 'video_id, platform' });
    }

    // Try to trigger n8n, but don't fail if it doesn't work
    try {
      const n8nResult = await triggerPublishWorkflow({
        videoId,
        userId: user.id,
        videoUrl: video.video_url,
        title: video.title ?? "Untitled",
        description: video.description ?? "",
        hashtags: video.hashtags ?? [],
        platforms,
        scheduledAt: video.scheduled_at ?? undefined,
      });

      if (!n8nResult.success) {
        console.warn("n8n trigger warning:", n8nResult.error);
      }
    } catch (n8nErr) {
      console.warn("n8n not available, skipping:", n8nErr);
    }

    return NextResponse.json({
      success: true,
      videoId,
    });
  } catch (err) {
    console.error("Publish failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 }
    );
  }
}
