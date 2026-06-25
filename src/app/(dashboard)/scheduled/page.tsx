"use client";

import { useEffect, useState, useCallback } from "react";
import { VideoTable } from "@/components/video-table";
import type { Video } from "@/types";
import { Loader2 } from "lucide-react";

export default function ScheduledPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos?status=scheduled", {
        cache: "no-store",
      });

      const data = await res.json();
      setVideos(data.videos ?? []);
    } catch (error) {
      console.error("Failed to load scheduled videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();

    const interval = setInterval(loadVideos, 5000);

    return () => clearInterval(interval);
  }, [loadVideos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scheduled Videos</h1>
        <p className="text-muted-foreground">Videos queued for publishing</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <VideoTable
          videos={videos}
          onDelete={(id) => setVideos((v) => v.filter((x) => x.id !== id))}
          emptyMessage="No scheduled videos. Upload and schedule a video to get started."
        />
      )}
    </div>
  );
}