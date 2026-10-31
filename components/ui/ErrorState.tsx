import { AlertTriangle } from "lucide-react";

export function ErrorState({ title = "Something went wrong", description }: { title?: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6" role="alert">
      <div className="size-12 rounded-full bg-red-950/40 border border-red-900 flex items-center justify-center mb-4">
        <AlertTriangle className="size-5 text-red-400" />
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-faint max-w-xs">{description}</p>
    </div>
  );
}
