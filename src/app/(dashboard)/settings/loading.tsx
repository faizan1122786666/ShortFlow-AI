export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-32 rounded-lg bg-muted" />
        <div className="h-4 w-56 rounded bg-muted" />
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>
        ))}
        <div className="h-10 w-28 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
