import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata } from "@/services/gemini";

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
    const { type, context, videoId } = body;

    if (!type || !["title", "description", "hashtags", "all"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    let ctx = context ?? "short form vertical video content";

    if (videoId) {
      const { data: video } = await supabase
        .from("videos")
        .select("title, description")
        .eq("id", videoId)
        .eq("user_id", user.id)
        .single();

      if (video) {
        ctx = video.title ?? video.description ?? ctx;
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          title: type === "title" || type === "all" ? "Amazing Short Video" : undefined,
          description:
            type === "description" || type === "all"
              ? "Check out this incredible short-form content!"
              : undefined,
          hashtags:
            type === "hashtags" || type === "all"
              ? ["#shorts", "#viral", "#trending", "#fyp"]
              : undefined,
        },
        { status: 200 }
      );
    }

    const result = await generateMetadata(type, ctx);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
