import { Layout } from "@/components/molecules/layout";
import { CreateNewPlanCard } from "@/components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@/components/organisms/findCollisionsCard";
import { PlanChangeYearCard } from "@/components/organisms/planChangeYearCard";
import { PlanEditLockedWarningCard } from "@/components/organisms/planEditLockedWarningCard";
import { PublicPlansCard } from "@/components/organisms/publicPlansCard";
import { TimeUntilMottagningCard } from "@/components/organisms/timeUntilMottagningCard";
import { UserPlansListCard } from "@/components/organisms/userPlansListCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useStorePlanYear } from "@/hooks/useStorePlanYear";
import { auth } from "@/services/config";

export function DashboardPage() {
  const { planEditLocked } = useAdminSettings();
  const { planYear } = useStorePlanYear();

  const lastSignInTime = auth.currentUser?.metadata?.lastSignInTime;
  const userHasNotSignedInSinceV3 = lastSignInTime
    ? new Date(lastSignInTime) < new Date("2025-03-01")
    : false;

  return (
    <Layout>
      {userHasNotSignedInSinceV3 && (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>👩‍💻 Bokningsplanering 3.0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              En ny version av hemsidan är här - och det är en fullständig
              omskrivning.
              <br />
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
            </p>
          </CardContent>
        </Card>
      )}
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
