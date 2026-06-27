"use client";

import { cn, getPlatformLabel } from "@/lib/utils";
import type { Platform } from "@/types";
import { Youtube, Music2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  className?: string;
}

const platforms: { id: Platform; icon: typeof Youtube; unavailable?: boolean }[] = [
  { id: "youtube", icon: Youtube },
  { id: "tiktok", icon: Music2, unavailable: true },
];

export function PlatformSelector({
  selected,
  onChange,
  className,
}: PlatformSelectorProps) {
  function toggle(platform: Platform) {
    if (platform === "tiktok") {
      return;
    }

    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  }

  return (
    <TooltipProvider>
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {platforms.map(({ id, icon: Icon, unavailable }) => {
          const isSelected = selected.includes(id);
          const button = (
            <button
              key={id}
              type="button"
              disabled={unavailable}
              onClick={() => toggle(id)}
              className={cn(
                "flex h-full w-full flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                unavailable && "cursor-not-allowed opacity-70 hover:opacity-80",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{getPlatformLabel(id)}</span>
            </button>
          );

          if (!unavailable) {
            return button;
          }

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div className="h-full w-full">{button}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>TikTok integration is currently unavailable. Coming soon.</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
