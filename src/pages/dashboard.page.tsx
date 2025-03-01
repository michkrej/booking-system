import { Layout } from "@/components/molecules/layout";
import { CreateNewPlanCard } from "@/components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@/components/organisms/findCollisionsCard";
import { PlanChangeYearCard } from "@/components/organisms/planChangeYearCard";
import { PublicPlansCard } from "@/components/organisms/publicPlansCard";
import { UserPlansListCard } from "@/components/organisms/userPlansListCard";
import { TimeUntilMottagningCard } from "@/components/organisms/timeUntilMottagningCard";
import { PlanEditLockedWarningCard } from "@/components/organisms/planEditLockedWarningCard";
import { usePlanEditLock, usePlanYear } from "@/state";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export function DashboardPage() {
  const { planEditLocked } = usePlanEditLock();
  const { planYear } = usePlanYear();

  return (
    <Layout>
      <div className="grid-auto-rows grid grid-cols-7 gap-4">
        <div className="col-span-5 grid grid-cols-4 gap-4">
          {!planEditLocked && planYear === CURRENT_YEAR ? (
            <CreateNewPlanCard />
          ) : (
            <PlanEditLockedWarningCard />
          )}
          <TimeUntilMottagningCard />
          <PlanChangeYearCard />
          <UserPlansListCard />
          <FindCollisionsCard />
        </div>
        <PublicPlansCard />
      </div>
    </Layout>
  );
}
