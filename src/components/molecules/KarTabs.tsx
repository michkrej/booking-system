import { cn } from "@/utils/utils";

interface Tab<T extends string = string> {
  label: string;
  value: T;
}

interface KarTabsProps<T extends string> {
  tabs: readonly Tab<T>[];
  active: NoInfer<T>;
  onSelect: (value: NoInfer<T>) => void;
  className?: string;
}

export const KarTabs = <T extends string>({
  tabs,
  active,
  onSelect,
  className,
}: KarTabsProps<T>) => {
  return (
    <div
      className={cn("flex overflow-x-auto border-b border-border", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSelect(tab.value)}
          className={cn(
            "px-3.5 py-2 text-xs font-normal whitespace-nowrap border-b-2 transition-colors",
            active === tab.value
              ? "font-bold text-primary bg-primary/10 border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
