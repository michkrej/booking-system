import { cn } from "@/utils/utils";

export type PlannerTab = "Mina" | "Krockar" | "Alla";
export type SpectatorTab = "Översikt" | "Krockar" | "Planeringar";

interface MobileTabNavProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export function MobileTabNav<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: MobileTabNavProps<T>) {
  return (
    <div
      className={cn(
        "flex bg-card border-b border-border overflow-x-auto lg:hidden",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex-1 px-3 py-2.5 text-sm font-normal whitespace-nowrap border-b-2 transition-colors",
            activeTab === tab
              ? "font-bold text-primary bg-primary/10 border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export const PLANNER_TABS = ["Mina", "Krockar", "Alla"] as const;
export const SPECTATOR_TABS = ["Översikt", "Krockar", "Planeringar"] as const;
