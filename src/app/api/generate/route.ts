import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata } from "@/services/ai-metadata";
import type { ApiKeyProviders } from "@/hooks/use-api-keys";

const VALID_PROVIDERS = ["gemini", "openai", "anthropic", "groq", "openrouter"] as const;
const PROVIDER_ALIASES: Record<string, ApiKeyProviders> = {
  gemini: "gemini",
  google: "gemini",
  "google-gemini": "gemini",
  openai: "openai",
  chatgpt: "openai",
  anthropic: "anthropic",
  claude: "anthropic",
  groq: "groq",
  grok: "groq",
  openrouter: "openrouter",
  "open-router": "openrouter",
};

function normalizeProvider(provider: unknown): ApiKeyProviders | null {
  if (typeof provider !== "string") return null;

  return PROVIDER_ALIASES[provider.trim().toLowerCase()] ?? null;
}

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
    const { type, context, videoId, provider: requestedProvider } = body as {
      type?: "title" | "description" | "hashtags" | "all";
      context?: string;
      videoId?: string;
      provider?: unknown;
    };

    if (!type || !["title", "description", "hashtags", "all"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const provider =
      normalizeProvider(requestedProvider) ??
      normalizeProvider(request.headers.get("x-ai-provider"));
    if (!provider || !VALID_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid AI provider. Use one of: ${VALID_PROVIDERS.join(", ")}.` },
        { status: 400 }
      );
    }

    const apiKey = request.headers.get("x-ai-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: `No ${provider} API key provided. Please set it in the API Keys page.` }, { status: 401 });
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

    const result = await generateMetadata(provider, type, ctx, apiKey);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
