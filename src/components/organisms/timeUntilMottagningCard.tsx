import { differenceInMilliseconds, format } from "date-fns";
import { sv } from "date-fns/locale";

import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useStoreUser } from "@/hooks/useStoreUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

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

export const TimeUntilMottagningCard = () => {
  const { mottagningStart } = useAdminSettings();
  const { user } = useStoreUser();

  if (user.kår === "Övrigt") return null;

  const date = mottagningStart[user.kår];

  const weeksToNolleP = getWeeksLeftToNolleP(date);
  const progress = getPercentageProgress(date);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Mottagnigen för {user.kår} börjar</CardDescription>
        <div className="flex items-center gap-2">
          <CardTitle>{format(date, "P", { locale: sv })}</CardTitle>
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
