import { generateMetadata as generateGeminiMetadata } from "@/services/gemini";
import type { ApiKeyProviders } from "@/hooks/use-api-keys";
import type { GenerateMetadataResponse } from "@/types";

type GenerateType = "title" | "description" | "hashtags" | "all";

const systemPrompt =
  "You create metadata for short-form vertical videos. Return concise, platform-ready text.";

function promptFor(type: GenerateType, context: string) {
  const base = `Context: ${context}`;

  if (type === "title") {
    return `${base}\nGenerate one catchy, SEO-friendly title. Return only the title, no quotes.`;
  }

  if (type === "description") {
    return `${base}\nGenerate one engaging description under 500 characters. Return only the description.`;
  }

  if (type === "hashtags") {
    return `${base}\nGenerate 10 relevant hashtags. Return only hashtags separated by spaces, each starting with #.`;
  }

  return `${base}
Generate metadata as JSON only with this shape:
{"title":"...","description":"...","hashtags":["#tag1","#tag2"]}
Use one catchy title, one description under 500 characters, and 10 relevant hashtags.`;
}

function parseHashtags(text: string) {
  const matches = text.match(/#[\p{L}\p{N}_-]+/gu) ?? [];
  return [...new Set(matches)].slice(0, 10);
}

function parseAll(text: string): GenerateMetadataResponse {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    const jsonText = cleaned.match(/\{[\s\S]*\}/)?.[0] ?? cleaned;
    const data = JSON.parse(jsonText) as GenerateMetadataResponse;
    return {
      title: typeof data.title === "string" ? sanitizeText(data.title) : undefined,
      description:
        typeof data.description === "string" ? sanitizeText(data.description) : undefined,
      hashtags: Array.isArray(data.hashtags)
        ? parseHashtags(data.hashtags.join(" "))
        : undefined,
    };
  } catch {
    return { description: text.trim() };
  }
}

function sanitizeText(text: string) {
  return text.trim().replace(/^["']|["']$/g, "");
}

function parseResult(type: GenerateType, text: string): GenerateMetadataResponse {
  const cleanText = sanitizeText(text);

  if (type === "title") return { title: cleanText };
  if (type === "description") return { description: cleanText };
  if (type === "hashtags") return { hashtags: parseHashtags(cleanText) };
  return parseAll(cleanText);
}

async function callOpenAICompatible({
  apiKey,
  url,
  model,
  type,
  context,
  extraHeaders,
}: {
  apiKey: string;
  url: string;
  model: string;
  type: GenerateType;
  context: string;
  extraHeaders?: Record<string, string>;
}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptFor(type, context) },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "AI provider request failed");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("AI provider returned an empty response");
  }

  return parseResult(type, text);
}

async function callAnthropic(apiKey: string, type: GenerateType, context: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 700,
      system: systemPrompt,
      messages: [{ role: "user", content: promptFor(type, context) }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Anthropic request failed");
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    throw new Error("Anthropic returned an empty response");
  }

  return parseResult(type, text);
}

export async function generateMetadata(
  provider: ApiKeyProviders,
  type: GenerateType,
  context: string,
  apiKey: string
): Promise<GenerateMetadataResponse> {
  if (provider === "gemini") {
    return generateGeminiMetadata(type, context, apiKey);
  }

  if (provider === "openai") {
    return callOpenAICompatible({
      apiKey,
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      type,
      context,
    });
  }

  if (provider === "anthropic") {
    return callAnthropic(apiKey, type, context);
  }

  if (provider === "groq") {
    return callOpenAICompatible({
      apiKey,
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant",
      type,
      context,
    });
  }

  return callOpenAICompatible({
    apiKey,
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "openai/gpt-4o-mini",
    type,
    context,
    extraHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "ShortFlow AI",
    },
  });
}
