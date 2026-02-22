import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { useActiveYear } from "@/hooks/useActiveYear";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { CURRENT_YEAR } from "@/utils/constants";

export const EditPlansLockedCard = () => {
  const { isPlanEditLocked } = useAdminSettings();
  const { activeYear } = useActiveYear();

  if (!isPlanEditLocked) return null;

  const isCurrentYear = activeYear === CURRENT_YEAR;

  return (
    <Card>
      <CardHeader>
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
