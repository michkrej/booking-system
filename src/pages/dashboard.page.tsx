import { useAdminSettings } from "@hooks/useAdminSettings";
import { Layout } from "@components/molecules/layout";
import { NewUpdateCard } from "@components/organisms/NewUpdateCard";
import { CreateNewPlanCard } from "@components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@components/organisms/findCollisionsCard";
import { PlanChangeYearCard } from "@components/organisms/planChangeYearCard";
import { PlanEditLockedWarningCard } from "@components/organisms/planEditLockedWarningCard";
import { PublicPlansCard } from "@components/organisms/publicPlansCard";
import { TimeUntilMottagningCard } from "@components/organisms/timeUntilMottagningCard";
import { UserPlansListCard } from "@components/organisms/userPlansListCard";

export function DashboardPage() {
  const { isPlanEditLocked } = useAdminSettings();

  return (
    <Layout>
      <NewUpdateCard />

      <div className="grid-auto-rows grid grid-cols-7 gap-4">
        <div className="col-span-5 grid grid-cols-4 gap-4">
          {!isPlanEditLocked ? (
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
