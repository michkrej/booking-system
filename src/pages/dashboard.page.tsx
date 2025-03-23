import { Layout } from "@/components/molecules/layout";
import { CreateNewPlanCard } from "@/components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@/components/organisms/findCollisionsCard";
import { NewUpdateCard } from "@/components/organisms/NewUpdateCard";
import { PlanChangeYearCard } from "@/components/organisms/planChangeYearCard";
import { PlanEditLockedWarningCard } from "@/components/organisms/planEditLockedWarningCard";
import { PublicPlansCard } from "@/components/organisms/publicPlansCard";
import { TimeUntilMottagningCard } from "@/components/organisms/timeUntilMottagningCard";
import { UserPlansListCard } from "@/components/organisms/userPlansListCard";
import { useAdminSettings } from "@/hooks/useAdminSettings";

export function DashboardPage() {
  const { planEditLocked } = useAdminSettings();

  return (
    <Layout>
      <NewUpdateCard />

      <div className="grid-auto-rows grid grid-cols-7 gap-4">
        <div className="col-span-5 grid grid-cols-4 gap-4">
          {!planEditLocked ? (
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
