"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
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
