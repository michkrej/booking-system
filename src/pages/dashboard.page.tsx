import { Layout } from "@/components/molecules/layout";
import { CreateNewPlanCard } from "@/components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@/components/organisms/findCollisionsCard";
import { PlanChangeYearCard } from "@/components/organisms/planChangeYearCard";
import { PlanEditLockedWarningCard } from "@/components/organisms/planEditLockedWarningCard";
import { PublicPlansCard } from "@/components/organisms/publicPlansCard";
import { TimeUntilMottagningCard } from "@/components/organisms/timeUntilMottagningCard";
import { UserPlansListCard } from "@/components/organisms/userPlansListCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useBoundStore } from "@/state/store";
import { XIcon } from "lucide-react";

export function DashboardPage() {
  const { planEditLocked } = useAdminSettings();
  const versionUpdateWarningClosed = useBoundStore(
    (state) => state.versionUpdateWarningClosed,
  );
  const closeVersionUpdateWarning = useBoundStore(
    (state) => state.closeVersionUpdateWarning,
  );

  return (
    <Layout>
      {!versionUpdateWarningClosed ? (
        <Card className="col-span-full flex flex-row">
          <CardHeader className="w-full flex-row items-center gap-x-10">
            <CardTitle>👩‍💻 Bokningsplanering 3.0</CardTitle>
            <CardDescription className="flex-1">
              En ny version av hemsidan är här - och det är en fullständig
              omskrivning.
              <br />
              <i>
                Om något inte fungerar{" "}
                <a
                  className="font-semibold text-primary decoration-primary hover:underline"
                  href={siteConfig.links.feedback}
                  target="__blank"
                >
                  rapportera det
                </a>
              </i>
            </CardDescription>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeVersionUpdateWarning}
            >
              Ok
            </Button>
          </CardHeader>
        </Card>
      ) : null}

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
