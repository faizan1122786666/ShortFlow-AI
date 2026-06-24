export default function UploadLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-40 rounded-lg bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="h-10 w-32 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
