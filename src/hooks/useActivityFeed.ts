import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useMemo } from "react";
import { convertToDate, getCommittee } from "@/lib/utils";
import { usePublicPlans } from "./usePublicPlans";
import { useUserPlans } from "./useUserPlans";

export interface ActivityItem {
  id: string;
  planId: string;
  fadderiName: string;
  kar: string;
  color: string;
  action: string;
  timeAgo: string;
  updatedAt: Date;
}

export const useActivityFeed = (limit = 5) => {
  const { publicPlans, isPending } = usePublicPlans();
  const { userPlans } = useUserPlans();

  // Get IDs of user's own plans to exclude them
  const userPlanIds = useMemo(() => {
    return new Set(userPlans.map((plan) => plan.id));
  }, [userPlans]);

  const activityItems = useMemo(() => {
    // Filter out user's own plans
    const otherPlans = publicPlans.filter((plan) => !userPlanIds.has(plan.id));

    // Sort by updatedAt descending
    const sortedPlans = [...otherPlans].sort((a, b) => {
      const aTime = convertToDate(a.updatedAt).getTime();
      const bTime = convertToDate(b.updatedAt).getTime();
      return bTime - aTime;
    });

    // Take the most recent plans
    const recentPlans = sortedPlans.slice(0, limit);

    // Convert to activity items
    return recentPlans.map((plan): ActivityItem => {
      const committee = getCommittee(plan.committeeId);
      const updatedAt = convertToDate(plan.updatedAt);
      const createdAt = convertToDate(plan.createdAt);

      // Determine action based on whether plan was recently created or updated
      // If created and updated within 1 hour, consider it "published"
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      const isNewlyPublished = timeDiff < 3600000; // 1 hour in ms

      const action = isNewlyPublished
        ? "Publicerade sin planering"
        : "Uppdaterade sin planering";

      return {
        id: plan.id,
        planId: plan.id,
        fadderiName: committee?.name || plan.label,
        kar: committee?.kår || "Övrigt",
        color: committee?.color || "#808080",
        action,
        timeAgo: formatDistanceToNow(updatedAt, {
          locale: sv,
          addSuffix: false,
        }),
        updatedAt,
      };
    });
  }, [publicPlans, userPlanIds, limit]);

  return {
    activityItems,
    isPending,
  };
};
