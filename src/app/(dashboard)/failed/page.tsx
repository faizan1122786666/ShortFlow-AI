"use client";

import { useEffect, useState } from "react";
import { VideoTable } from "@/components/video-table";
import type { Video } from "@/types";
import { Loader2 } from "lucide-react";

export default function FailedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos?status=failed")
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
        <h1 className="text-3xl font-bold">Failed Videos</h1>
        <p className="text-muted-foreground">Videos that encountered errors during publishing</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <VideoTable videos={videos} emptyMessage="No failed videos." />
      )}
    </div>
  );
}
