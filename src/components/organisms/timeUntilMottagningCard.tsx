import { format } from "date-fns";
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
import { getPercentageProgress, getWeeksLeftToNolleP } from "@/utils/helpers";

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
