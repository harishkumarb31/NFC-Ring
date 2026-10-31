export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" role="status" aria-live="polite">
      <div className="ring-mark size-8" />
      <span className="text-xs text-text-faint">{label}…</span>
    </div>
  );
}
