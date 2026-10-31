import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, endAdornment, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg bg-surface-1 border border-border-hair px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-faint",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent transition-colors",
              endAdornment && "pr-10",
              error && "border-red-800",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-text-faint">
              {endAdornment}
            </div>
          )}
        </div>
        {hint && !error && <span className="text-xs text-text-faint">{hint}</span>}
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
