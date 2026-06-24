"use client";

import { useEffect, useState } from "react";
import { VideoTable } from "@/components/video-table";
import type { Video } from "@/types";
import { Loader2 } from "lucide-react";

export default function ScheduledPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos?status=scheduled")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
