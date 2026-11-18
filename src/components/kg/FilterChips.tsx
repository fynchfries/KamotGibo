import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

/** Single-select chip row. Tapping the active chip clears it. */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? undefined : o.value)}
              className={cn(
                "min-h-11 cursor-pointer rounded-lg border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-sea bg-sea text-sea-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-sea hover:bg-secondary hover:text-primary",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
