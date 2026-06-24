"use client";

import type { Video } from "@/types";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, getPlatformLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";

interface VideoTableProps {
  videos: Video[];
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function VideoTable({
  videos,
  onDelete,
  emptyMessage = "No videos found",
}: VideoTableProps) {
  async function handleDelete(id: string) {
    if (!confirm("Delete this video?")) return;

    try {
      const response = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Video deleted");
      onDelete?.(id);
    } catch {
      toast.error("Failed to delete video");
    }
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <VideoIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Platforms</th>
            <th className="px-4 py-3 text-left font-medium">Scheduled</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{video.title ?? "Untitled"}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {video.description ?? "No description"}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {(video.platforms ?? []).map((p) => (
                    <span
                      key={p}
                      className="rounded bg-secondary px-2 py-0.5 text-xs"
                    >
                      {getPlatformLabel(p)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {video.scheduled_at
                  ? formatDate(video.scheduled_at)
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={video.status} />
              </td>
              <td className="px-4 py-3 text-right">
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(video.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
