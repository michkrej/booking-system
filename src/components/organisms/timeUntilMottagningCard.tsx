import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useStoreUser } from "@hooks/useStoreUser";
import { getPercentageProgress, getWeeksLeftToNolleP } from "@utils/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Progress } from "@ui/progress";

export const TimeUntilMottagningCard = () => {
  const { mottagningStart } = useAdminSettings();
  const { user } = useStoreUser();
  const { t } = useTranslation();

  if (user.kår === "Övrigt") return null;

  const date = mottagningStart[user.kår];
  const weeksToNolleP = getWeeksLeftToNolleP(date);
  const progress = getPercentageProgress(date);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {t("welcoming_week_for_committee_x_begins", { committee: user.kår })}
        </CardDescription>
        <div className="flex items-center gap-2">
          <CardTitle>{format(date, "P", { locale: sv })}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p>{t("x_weeks_left", { x: weeksToNolleP })}</p>
      </CardContent>
      <CardFooter>
        <Progress value={progress} />
      </CardFooter>
    </Card>
  );
};
