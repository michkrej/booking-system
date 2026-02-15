import { cn } from "@lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { useActivityFeed } from "@/hooks/useActivityFeed";

const KAR_COLORS: Record<string, string> = {
  LinTek: "#E1007A",
  Consensus: "2cb2bf",
  StuFF: "007858",
  Övrigt: "text-muted-foreground",
};

export const ActivityFeedCard = () => {
  const { activityItems, isPending } = useActivityFeed(5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Senaste aktivitet</CardTitle>
        <CardDescription>Uppdateringar från andra fadderier</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isPending ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0"
              >
                <Skeleton className="w-2 h-2 rounded-none" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            ))}
          </div>
        ) : activityItems.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted-foreground">
            Ingen aktivitet att visa
          </div>
        ) : (
          <div className="space-y-0">
            {activityItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 px-5 py-3 border-b border-border last:border-b-0"
              >
                <span
                  className="w-2 h-2 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold text-foreground">
                  {item.fadderiName}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold shrink-0",
                    KAR_COLORS[item.kar] || KAR_COLORS["Övrigt"],
                  )}
                >
                  {item.kar}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  {item.action}
                </span>
                <span className="text-xs text-muted-foreground ml-auto shrink-0">
                  {item.timeAgo}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
