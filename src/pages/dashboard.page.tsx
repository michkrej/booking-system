import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useCreatePlan } from "@hooks/useCreatePlan";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { useStoreUser } from "@hooks/useStoreUser";
import { useUserPlans } from "@hooks/useUserPlans";
import { CURRENT_YEAR } from "@utils/CONSTANTS";
import { getCommittee } from "@lib/utils";
import { InlineYearSelector } from "@components/molecules/InlineYearSelector";
import {
  MobileTabNav,
  PLANNER_TABS,
  type PlannerTab,
  SPECTATOR_TABS,
  type SpectatorTab,
} from "@components/molecules/MobileTabNav";
import { LoadingButton } from "@components/molecules/loadingButton";
import { ActivityFeedCard } from "@components/organisms/ActivityFeedCard";
import { SpectatorDashboard } from "@components/organisms/SpectatorDashboard";
import { UserConflictsCard } from "@components/organisms/UserConflictsCard";
import { PlanEditLockedWarningCard } from "@components/organisms/planEditLockedWarningCard";
import { PublicPlansCard } from "@components/organisms/publicPlansCard";
import { UserPlansListCard } from "@components/organisms/userPlansListCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { DashboardLayout } from "@/components/molecules/DashboardLayout";
import { SidebarPublicPlans } from "@/components/organisms/SidebarPublicPlans";
import { MAX_YEAR, MIN_YEAR } from "@/state/planStoreSlice";

const formSchema = z.object({
  planName: z.string().min(1, "Du måste ange ett namn för planeringen"),
});

export function DashboardPage() {
  const { t } = useTranslation();
  const { isPlanEditLocked } = useAdminSettings();
  const { user } = useStoreUser();
  const { planYear, incrementPlanYear, decrementPlanYear } = useStorePlanYear();
  const { userPlans, isPending: isLoadingPlans } = useUserPlans();
  const { createPlan, isPending: isCreating } = useCreatePlan();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [plannerTab, setPlannerTab] = useState<PlannerTab>("Mina");
  const [spectatorTab, setSpectatorTab] = useState<SpectatorTab>("Översikt");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: user.committee?.name ?? "",
    },
  });

  const isMinYear = useMemo(() => planYear <= MIN_YEAR, [planYear]);
  const isMaxYear = useMemo(() => planYear >= MAX_YEAR, [planYear]);

  const committee = getCommittee(user.committeeId);

  // Determine if user is a spectator (has no plans)
  const isSpectator = !isLoadingPlans && userPlans.length === 0;

  // Context label changes for spectators
  const contextLabel = isSpectator
    ? "Översikt för alla planeringar"
    : committee
      ? `${user.kår} · ${committee.name}`
      : user.kår;

  const handleCreatePlan = () => {
    if (!isPlanEditLocked && planYear >= CURRENT_YEAR) {
      setShowCreateDialog(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createPlan({
      planName: values.planName,
      onSettled: () => {
        form.reset();
        setShowCreateDialog(false);
      },
    });
  };

  return (
    <DashboardLayout sidebar={<SidebarPublicPlans />} hideFooter>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{contextLabel}</p>
        </div>
        <InlineYearSelector
          year={planYear}
          onIncrement={incrementPlanYear}
          onDecrement={decrementPlanYear}
          isMinYear={isMinYear}
          isMaxYear={isMaxYear}
        />
      </div>

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

          <div className="flex gap-4">
            {/* Mobile: Show content based on active tab */}
            <div className="lg:hidden space-y-4">
              {spectatorTab === "Översikt" && (
                <SpectatorDashboard onCreatePlan={handleCreatePlan} />
              )}
              {spectatorTab === "Krockar" && (
                <SpectatorDashboard onCreatePlan={handleCreatePlan} />
              )}
              {spectatorTab === "Planeringar" && <PublicPlansCard />}
            </div>

            {/* Desktop: Show full layout */}
            <div className="hidden lg:block w-full">
              <SpectatorDashboard onCreatePlan={handleCreatePlan} />
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
            className="mb-4 -mx-4 sm:-mx-6 px-0"
          />

          <div className="flex gap-4">
            {/* Mobile: Show content based on active tab */}
            <div className=" lg:hidden space-y-4">
              {isPlanEditLocked && <PlanEditLockedWarningCard />}

              {plannerTab === "Mina" && (
                <>
                  <UserPlansListCard showCreateButton={!isPlanEditLocked} />
                  <ActivityFeedCard />
                </>
              )}
              {plannerTab === "Krockar" && <UserConflictsCard />}
              {plannerTab === "Alla" && (
                <div className="border border-b-0 bg-card">
                  <SidebarPublicPlans />
                </div>
              )}
            </div>

            {/* Desktop: Show full layout */}
            <div className="hidden lg:block w-full space-y-4">
              {isPlanEditLocked && <PlanEditLockedWarningCard />}

              <UserPlansListCard showCreateButton={!isPlanEditLocked} />

              <UserConflictsCard />

              <ActivityFeedCard />
            </div>
          </div>
        </>
      )}

      {/* Create Plan Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(state) => {
          setShowCreateDialog(state);
          form.reset();
        }}
      >
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <DialogHeader>
                <DialogTitle>{t("create_new_plan.dialog_title")}</DialogTitle>
                <DialogDescription>
                  {t("create_new_plan.dialog_description")}
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        id="plan-name"
                        type="text"
                        placeholder={t("create_new_plan.dialog_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <LoadingButton
                  type="submit"
                  loading={isCreating}
                  className="mt-4"
                >
                  {t("create")}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
