"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlatformSelector } from "@/components/platform-selector";
import { DateTimePicker } from "@/components/date-time-picker";
import { AIGenerator } from "@/components/ai-generator";
import type { Platform } from "@/types";
import { Upload, Loader2, FileVideo } from "lucide-react";
import { toast } from "sonner";

export function VideoUploadForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("12:00");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const context = title || description || "short form vertical video";

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const dropped = e.dataTransfer.files[0];

    if (dropped?.type.startsWith("video/")) {
      setFile(dropped);
    } else {
      toast.error("Please upload a video file");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (!date) {
      toast.error("Please select a schedule date");
      return;
    }

    if (!time) {
      toast.error("Please select a schedule time");
      return;
    }

    if (platforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }

    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload MP4, MOV, or WebM.");
      return;
    }

    const MAX_SIZE = 100 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 100 MB");
      return;
    }

    setUploading(true);

    try {
      const [hours, minutes] = time.split(":");
      const scheduled = new Date(date);

      scheduled.setHours(Number(hours), Number(minutes), 0, 0);

      if (scheduled.getTime() <= Date.now()) {
        toast.error("Scheduled time must be in the future");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("hashtags", hashtags);
      formData.append("platforms", JSON.stringify(platforms));
      formData.append("scheduledAt", scheduled.toISOString());

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error ?? "Upload failed");
      }

      toast.success("Video scheduled successfully!");

      router.push("/scheduled");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            Upload a short-form vertical video MP4, WebM, or MOV
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileVideo className="h-12 w-12 text-primary" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  Drag & drop or click to upload
                </p>

                <Input
                  type="file"
                  accept="video/*"
                  className="max-w-xs"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platforms</CardTitle>
          <CardDescription>Choose where to publish</CardDescription>
        </CardHeader>

        <CardContent>
          <PlatformSelector selected={platforms} onChange={setPlatforms} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Set date and time for publishing</CardDescription>
        </CardHeader>

        <CardContent>
          <DateTimePicker
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Add details or generate with AI</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <AIGenerator
            context={context}
            onGenerated={(data) => {
              if (data.title) setTitle(data.title);
              if (data.description) setDescription(data.description);
              if (data.hashtags) setHashtags(data.hashtags.join(" "));
            }}
          />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#shorts #viral #trending"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scheduling...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Schedule Video
          </>
        )}
      </Button>
    </form>
  );
}
