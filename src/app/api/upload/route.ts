import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = ((formData.get("title") as string) || "").trim() || null;
    const description =
      ((formData.get("description") as string) || "").trim() || null;
    const hashtagsRaw = (formData.get("hashtags") as string) || "";
    const platformsRaw = formData.get("platforms") as string;
    const scheduledAtRaw = (formData.get("scheduledAt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!scheduledAtRaw.trim()) {
      return NextResponse.json(
        { error: "scheduledAt is required" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAtRaw);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid scheduledAt" }, { status: 400 });
    }

    if (scheduledDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const cleanScheduledAt = scheduledDate.toISOString();

    const MAX_SIZE = 100 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only MP4, MOV, and WebM are allowed." },
        { status: 400 }
      );
    }

    const hashtags = hashtagsRaw
      .split(/\s+/)
      .map((h) => h.trim())
      .filter(Boolean)
      .map((h) => (h.startsWith("#") ? h : `#${h}`));

    let platforms: Platform[] = [];

    try {
      platforms = JSON.parse(platformsRaw) as Platform[];
    } catch {
      return NextResponse.json({ error: "Invalid platforms" }, { status: 400 });
    }

    if (!platforms.length) {
      return NextResponse.json(
        { error: "At least one platform is required" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() ?? "mp4";
    const filePath = `${user.id}/${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("videos").getPublicUrl(filePath);

    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        video_url: publicUrl,
        title,
        description,
        hashtags,
        platforms,
        scheduled_at: cleanScheduledAt,
        status: "scheduled",
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ video }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
