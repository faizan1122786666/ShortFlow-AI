import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { VideoTable } from "@/components/video-table";
import type { Video } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allVideos = (videos ?? []) as Video[];
  const scheduled = allVideos.filter((v) => v.status === "scheduled").length;
  const published = allVideos.filter((v) => v.status === "published").length;
  const failed = allVideos.filter((v) => v.status === "failed").length;
  const recent = allVideos.slice(0, 5);

  const stats = [
    { label: "Total Videos", value: allVideos.length, icon: Upload },
    { label: "Scheduled Videos", value: scheduled, icon: Calendar },
    { label: "Published Videos", value: published, icon: CheckCircle },
    { label: "Failed Videos", value: failed, icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your video publishing pipeline
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Videos</h2>
        <VideoTable
          videos={recent}
          emptyMessage="No videos yet. Upload your first video!"
        />
      </div>
    </div>
  );
}
