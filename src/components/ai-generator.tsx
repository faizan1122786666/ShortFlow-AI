"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiKeyProviders, ApiKeys } from "@/hooks/use-api-keys";

const PROVIDER_ORDER: ApiKeyProviders[] = [
  "gemini",
  "openai",
  "anthropic",
  "groq",
  "openrouter",
];

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

function normalizeStoredKeys(keys: Record<string, unknown>): Partial<ApiKeys> {
  return Object.entries(keys).reduce<Partial<ApiKeys>>((normalized, [key, value]) => {
    const provider = PROVIDER_ALIASES[key.trim().toLowerCase()];

    if (provider && typeof value === "string") {
      normalized[provider] = value;
    }

    return normalized;
  }, {});
}

interface AIGeneratorProps {
  context: string;
  onGenerated: (data: {
    title?: string;
    description?: string;
    hashtags?: string[];
  }) => void;
  disabled?: boolean;
}

export function AIGenerator({ context, onGenerated, disabled }: AIGeneratorProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function generate(type: "title" | "description" | "hashtags" | "all") {
    if (!context.trim()) {
      toast.error("Add some context first (title hint or description)");
      return;
    }

    setLoading(type);
    try {
      // Get the locally stored API keys
      const storedKeys = localStorage.getItem("shortflow_api_keys");
      const parsedKeys = (storedKeys ? JSON.parse(storedKeys) : {}) as Record<string, unknown>;
      const apiKeys = normalizeStoredKeys(parsedKeys);
      const provider = PROVIDER_ORDER.find((key) => apiKeys[key]?.trim());
      const apiKey = provider ? apiKeys[provider]?.trim() : "";

      if (!provider || !apiKey) {
        toast.error("Add an API key first in the API Keys page");
        return;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-ai-api-key": apiKey,
          "x-ai-provider": provider,
        },
        body: JSON.stringify({ type, context, provider }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Generation failed");
      }

      const data = await response.json();
      onGenerated(data);
      toast.success(`Generated ${type === "all" ? "all metadata" : type}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(null);
    }
  }

  const buttons = [
    { type: "title" as const, label: "Title" },
    { type: "description" as const, label: "Description" },
    { type: "hashtags" as const, label: "Hashtags" },
    { type: "all" as const, label: "All" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map(({ type, label }) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || loading !== null}
          onClick={() => generate(type)}
        >
          {loading === type ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-3 w-3" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
}
