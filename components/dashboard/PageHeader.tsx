export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl text-text-primary">{title}</h1>
      {subtitle && <p className="text-sm text-text-faint mt-1">{subtitle}</p>}
    </div>
  );
}
