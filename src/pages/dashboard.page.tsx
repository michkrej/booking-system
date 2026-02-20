import { useEffect, useMemo, useState } from "react";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { useStoreUser } from "@hooks/useStoreUser";
import { useUserPlans } from "@hooks/useUserPlans";
import { InlineYearSelector } from "@components/molecules/InlineYearSelector";
import {
  MobileTabNav,
  PLANNER_TABS,
  type PlannerTab,
  SPECTATOR_TABS,
  type SpectatorTab,
} from "@components/molecules/MobileTabNav";
import { ActivityFeedCard } from "@components/organisms/ActivityFeedCard";
import { SpectatorDashboard } from "@components/organisms/SpectatorDashboard";
import { UserConflictsCard } from "@components/organisms/UserConflictsCard";
import { CreateNewPlanDialog } from "@/components/molecules/CreateNewPlanDialog";
import { DashboardLayout } from "@/components/molecules/DashboardLayout";
import { EditPlansLockedCard } from "@/components/organisms/EditPlansLockedCard";
import { NewUpdateCard } from "@/components/organisms/NewUpdateCard";
import { SidebarPublicPlans } from "@/components/organisms/SidebarPublicPlans";
import { UserPlansCard } from "@/components/organisms/UserPlansCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MAX_YEAR, MIN_YEAR } from "@/state/planStoreSlice";
import { useBoundStore } from "@/state/store";
import { CURRENT_YEAR } from "@/utils/constants";
import { cn, getCommittee } from "@/utils/utils";

export function DashboardPage() {
  const { isPlanEditLocked } = useAdminSettings();
  const { user } = useStoreUser();
  const { planYear, incrementPlanYear, decrementPlanYear } = useStorePlanYear();
  const { userPlans, isPending: isLoadingPlans } = useUserPlans();
  const appMode = useBoundStore((state) => state.appMode);
  const changedAppMode = useBoundStore((state) => state.changedAppMode);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [plannerTab, setPlannerTab] = useState<PlannerTab>("Mina");
  const [spectatorTab, setSpectatorTab] = useState<SpectatorTab>("Översikt");

  const isMinYear = useMemo(() => planYear <= MIN_YEAR, [planYear]);
  const isMaxYear = useMemo(() => planYear >= MAX_YEAR, [planYear]);
  const committee = getCommittee(user.committeeId);
  const isSpectator = appMode === "spectator";
  const canCreatePlan = !isPlanEditLocked && planYear >= CURRENT_YEAR;

  const handleCreatePlan = () => {
    setShowCreateDialog(true);
  };

  useEffect(() => {
    if (!isLoadingPlans && userPlans.length === 0) {
      changedAppMode("spectator");
    } else {
      changedAppMode("user");
    }
  }, [isLoadingPlans, userPlans, planYear]);

  return (
    <DashboardLayout sidebar={<SidebarPublicPlans />} hideFooter>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {isSpectator
              ? "Översikt för alla planeringar"
              : committee
                ? `${user.kår} · ${committee.name}`
                : user.kår}
          </p>
        </div>

        <div className="flex gap-x-4 gap-y-2 flex-col sm:flex-row">
          {userPlans.length > 0 && (
            <ToggleGroup
              type="single"
              value={appMode}
              onValueChange={changedAppMode}
              variant="outline"
            >
              <ToggleGroupItem
                value="user"
                className={cn(!isSpectator && "bg-secondary!")}
              >
                Översikt
              </ToggleGroupItem>
              <ToggleGroupItem
                value="spectator"
                className={cn(isSpectator && "bg-secondary!")}
              >
                Krockar
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <InlineYearSelector
            year={planYear}
            onIncrement={incrementPlanYear}
            onDecrement={decrementPlanYear}
            isMinYear={isMinYear}
            isMaxYear={isMaxYear}
          />
        </div>
      </div>

      <NewUpdateCard />

      {isSpectator ? (
        /* Spectator View */
        <>
          {/* Mobile Tab Navigation */}
          <MobileTabNav
            tabs={SPECTATOR_TABS}
            activeTab={spectatorTab}
            onTabChange={setSpectatorTab}
            className="mb-4 -mx-4 sm:-mx-6 px-0"
          />

          <div className="flex gap-2">
            {/* Mobile: Show content based on active tab */}
            <div className="lg:hidden space-y-2 flex-1">
              {spectatorTab !== "Planeringar" ? (
                <SpectatorDashboard
                  onCreatePlan={canCreatePlan ? handleCreatePlan : undefined}
                />
              ) : (
                <div className="border border-b-0 bg-card w-full">
                  <SidebarPublicPlans />
                </div>
              )}
            </div>

            {/* Desktop: Show full layout */}
            <div className="hidden lg:block w-full">
              <SpectatorDashboard
                onCreatePlan={canCreatePlan ? handleCreatePlan : undefined}
              />
            </div>
          </div>
        </>
      ) : (
        /* Planner View */
        <>
          {/* Mobile Tab Navigation */}
          <MobileTabNav
            tabs={PLANNER_TABS}
            activeTab={plannerTab}
            onTabChange={setPlannerTab}
            className="mb-2 -mx-2 sm:-mx-4 px-0"
          />

          <div className="flex gap-2">
            {/* Mobile: Show content based on active tab */}
            <div className="lg:hidden space-y-2 flex-1">
              {isPlanEditLocked && <EditPlansLockedCard />}

              {plannerTab === "Mina" && (
                <>
                  <UserPlansCard showCreateButton={!isPlanEditLocked} />
                  <ActivityFeedCard />
                </>
              )}
              {plannerTab === "Krockar" && <UserConflictsCard />}
              {plannerTab === "Alla" && (
                <div className="border border-b-0 bg-card w-full">
                  <SidebarPublicPlans />
                </div>
              )}
            </div>

            {/* Desktop: Show full layout */}
            <div className="hidden lg:block w-full space-y-4">
              {isPlanEditLocked && <EditPlansLockedCard />}

              <UserPlansCard showCreateButton={!isPlanEditLocked} />

              <UserConflictsCard />

              <ActivityFeedCard />
            </div>
          </div>
        </>
      )}

      <CreateNewPlanDialog
        onOpenChange={setShowCreateDialog}
        open={showCreateDialog}
      />
    </DashboardLayout>
  );
}
