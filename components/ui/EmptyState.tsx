import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="size-12 rounded-full bg-surface-2 border border-border-hair flex items-center justify-center mb-4">
        <Icon className="size-5 text-text-faint" />
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-faint max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
