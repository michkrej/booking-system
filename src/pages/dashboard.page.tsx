import { differenceInMilliseconds, format } from "date-fns";
import { sv } from "date-fns/locale";

import { Layout } from "@/components/molecules/layout";
import { CreateNewPlanCard } from "@/components/organisms/createNewPlanCard";
import { FindCollisionsCard } from "@/components/organisms/findCollisionsCard";
import { PlanChangeYearCard } from "@/components/organisms/planChangeYearCard";
import { PublicPlansCard } from "@/components/organisms/publicPlansCard";
import { UserPlansListCard } from "@/components/organisms/userPlansListCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMottagningStart, useUser } from "@/state";

export const getWeeksLeftToNolleP = (startDate: Date) => {
  const now = new Date();
  const diff = differenceInMilliseconds(startDate, now);
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
};

export const getTotalWeeksToNolleP = (startDate: Date) => {
  const endDate = new Date(`${new Date().getFullYear() - 1}-08-31`);
  const diff = differenceInMilliseconds(startDate, endDate);
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
};

export const getPercentageProgress = (startDate: Date) => {
  const weeksToNolleP = getWeeksLeftToNolleP(startDate);
  const totalWeeksToNolleP = getTotalWeeksToNolleP(startDate);
  const progress = Math.round(
    ((totalWeeksToNolleP - weeksToNolleP) / totalWeeksToNolleP) * 100,
  );
  return progress;
};

export function DashboardPage() {
  return (
    <Layout>
      <div className="grid-auto-rows grid grid-cols-7 gap-4">
        <div className="col-span-5 grid grid-cols-4 gap-4">
          <CreateNewPlanCard />
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

const TimeUntilMottagningCard = () => {
  const { mottagningStart } = useMottagningStart();
  const { kår } = useUser();

  if (kår === "Övrigt") return null;

  const weeksToNolleP = getWeeksLeftToNolleP(mottagningStart[kår]);
  const progress = getPercentageProgress(mottagningStart[kår]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Mottagnigen för {kår} börjar</CardDescription>
        <div className="flex items-center gap-2">
          <CardTitle>
            {format(mottagningStart[kår], "P", { locale: sv })}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p>
          <span>{weeksToNolleP}</span> veckor kvar
        </p>
      </CardContent>
      <CardFooter>
        <Progress value={progress} />
      </CardFooter>
    </Card>
  );
};
