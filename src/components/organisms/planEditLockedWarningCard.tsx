import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useStorePlanYear } from "@/hooks/useStorePlanYear";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export const PlanEditLockedWarningCard = () => {
  const { planEditLocked } = useAdminSettings();
  const { planYear } = useStorePlanYear();

  const isCurrentYear = planYear === CURRENT_YEAR;

  if (!planEditLocked && isCurrentYear) return null;

  return (
    <Card className="col-span-2">
      <CardHeader className="h-full">
        <CardTitle className="text-red-600">
          Redigering av planeringar är låst!
        </CardTitle>
        <CardDescription className="pt-2">
          {isCurrentYear ? (
            <p>
              En administratör har låst all redigering av planeringar. Om du
              behöver kunna redigera din planering, kontakta mottagningsansvarig
              för din kår.
            </p>
          ) : (
            <p>Du kan inte redigera planeringar för föregående år.</p>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
