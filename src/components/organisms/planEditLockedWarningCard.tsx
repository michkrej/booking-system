import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { CURRENT_YEAR } from "@/utils/constants";

export const PlanEditLockedWarningCard = () => {
  const { planYear } = useStorePlanYear();

  const isCurrentYear = planYear === CURRENT_YEAR;

  return (
    <Card>
      <CardHeader className="h-full">
        <CardTitle className="text-red-600">
          Redigering av planeringar är låst!
        </CardTitle>
        <CardDescription>
          {isCurrentYear ? (
            <p>
              En administratör har låst all redigering av bokningar för din kår.
              Om du behöver kunna redigera din planering, kontakta din
              mottagningsansvarig.
            </p>
          ) : (
            <p className="">
              Du kan inte redigera planeringar för föregående år.
            </p>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
