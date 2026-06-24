import { VideoUploadForm } from "@/components/video-upload-form";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-muted-foreground">
          Upload and schedule your short-form content
        </p>
      </div>
      <VideoUploadForm />
    </div>
  );
}
