"use client";

import { cn, getPlatformLabel } from "@/lib/utils";
import type { Platform } from "@/types";
import { Youtube, Music2 } from "lucide-react";

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  className?: string;
}

const platforms: { id: Platform; icon: typeof Youtube }[] = [
  { id: "youtube", icon: Youtube },
  { id: "tiktok", icon: Music2 },
];

export function PlatformSelector({
  selected,
  onChange,
  className,
}: PlatformSelectorProps) {
  function toggle(platform: Platform) {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {platforms.map(({ id, icon: Icon }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm font-medium">{getPlatformLabel(id)}</span>
          </button>
        );
      })}
    </div>
  );
}
