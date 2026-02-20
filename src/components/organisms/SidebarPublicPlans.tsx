import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAllConflicts } from "@hooks/useAllConflicts";
import { useCurrentDate } from "@hooks/useCurrentDate";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { useStoreBookings } from "@hooks/useStoreBookings";
import { useStoreUser } from "@hooks/useStoreUser";
import { useBoundStore } from "@state/store";
import { Tabs, TabsContent } from "@ui/tabs";
import { type Plan } from "@/interfaces/interfaces";
import { getCommittee } from "@/utils/utils";
import { KarTabs } from "../molecules/KarTabs";
import { SidebarPlanItem } from "../molecules/SidebarPlanItem";
import { ExportPlansButton } from "../molecules/exportPlansButton";
import { Button } from "../ui/button";

const TABS = {
  Alla: { label: "Alla", value: "all" },
  Consensus: { label: "Consensus", value: "consensus" },
  LinTek: { label: "LinTek", value: "lintek" },
  StuFF: { label: "StuFF", value: "stuff" },
} as const;

export const SidebarPublicPlans = () => {
  const { user } = useStoreUser();
  const { publicPlans, publicPlansByKar } = usePublicPlans();
  const { loadedBookings } = useStoreBookings();
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const { resetCurrentDate } = useCurrentDate();
  const { t } = useTranslation();
  const { getConflictsForPlan } = useAllConflicts();

  const committee = getCommittee(user.committeeId);
  const kar = committee?.kår;

  const defaultTab = kar === "Övrigt" || !kar ? TABS.Alla : TABS[kar];

  const [karFilter, setKarFilter] = useState(defaultTab.value);

  const handleViewAllClick = () => {
    const plans =
      karFilter === "all" ? publicPlans : publicPlansByKar[karFilter];
    const events = plans.flatMap((plan) => plan.events);
    loadedBookings(events);
    changedActivePlans(plans);
    resetCurrentDate();
    navigate(`/booking/view`);
  };

  const handlePlanClick = (plan: Plan) => {
    loadedBookings(plan.events);
    changedActivePlans([plan]);
    resetCurrentDate();
    navigate(`/booking/view`);
  };

  return (
    <Tabs value={karFilter} className="">
      <div className="px-5 pt-4 pb-2 relative flex flex-col gap-0.5">
        <h3 className="text-lg leading-none font-bold">
          {t("public_plans.title")}
        </h3>
        <div className="absolute right-2 top-3 space-x-3">
          <ExportPlansButton />
          <Button
            variant="outline"
            size="icon"
            className="h-8"
            onClick={handleViewAllClick}
          >
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mt-0.5">
          {t("public_plans.description")}
        </p>
      </div>
      <KarTabs
        tabs={Object.values(TABS)}
        active={karFilter}
        onSelect={setKarFilter}
        className="px-2"
      />
      {/* SECTION - all */}
      <TabsContent value={TABS.Alla.value}>
        {publicPlans.map((plan) => (
          <SidebarPlanItem
            key={plan.id}
            item={plan}
            conflictCount={getConflictsForPlan(plan.id)}
            onClick={() => handlePlanClick(plan)}
          />
        ))}
      </TabsContent>
      <TabsContent value={TABS.Consensus.value}>
        {publicPlansByKar.consensus.map((plan) => (
          <SidebarPlanItem
            key={plan.id}
            item={plan}
            conflictCount={getConflictsForPlan(plan.id)}
            onClick={() => handlePlanClick(plan)}
          />
        ))}
      </TabsContent>
      <TabsContent value={TABS.LinTek.value}>
        {publicPlansByKar.lintek.map((plan) => (
          <SidebarPlanItem
            key={plan.id}
            item={plan}
            conflictCount={getConflictsForPlan(plan.id)}
            onClick={() => handlePlanClick(plan)}
          />
        ))}
      </TabsContent>
      <TabsContent value={TABS.StuFF.value}>
        {publicPlansByKar.stuff.map((plan) => (
          <SidebarPlanItem
            key={plan.id}
            item={plan}
            conflictCount={getConflictsForPlan(plan.id)}
            onClick={() => handlePlanClick(plan)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};
