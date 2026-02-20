import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { KAR_COLORS } from "@/utils/colors";
import { FadderiTag } from "../molecules/FadderiTag";

export const ActivityFeedCard = () => {
  const { activityItems, isPending } = useActivityFeed(5);

  return (
    <Card>
      <CardHeader>
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
            {activityItems.map((item) => {
              const color =
                KAR_COLORS[item.kar]?.color || KAR_COLORS["Övrigt"].color;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 px-5 py-3 border-b border-border last:border-b-0 flex-wrap"
                >
                  <FadderiTag
                    name={item.fadderiName}
                    kar={item.kar}
                    color={color}
                  />

                  <span className="text-sm text-muted-foreground truncate">
                    {item.action}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {item.timeAgo}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
