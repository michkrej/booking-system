import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { useStoreUser } from "@hooks/useStoreUser";
import { MAX_YEAR, MIN_YEAR } from "@state/planStoreSlice";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";

export const PlanChangeYearCard = () => {
  const { user } = useStoreUser();
  const { planYear, incrementPlanYear, decrementPlanYear } = useStorePlanYear();

  const isMaxYear = useMemo(() => planYear >= MAX_YEAR, [planYear]);
  const isMinYear = useMemo(() => planYear <= MIN_YEAR, [planYear]);

  return (
    <Card
      className={cn(
        "flex flex-col justify-between",
        user.kår === "Övrigt" ? "col-span-2" : "",
      )}
    >
      <CardHeader className="pb-7">
        <CardDescription>Planeringar för året</CardDescription>
        <CardTitle>{planYear}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end gap-x-4 pb-4">
        <div className="text-muted-foreground text-xs">Byt år:</div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 text-sm"
            disabled={isMinYear}
            onClick={decrementPlanYear}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 text-sm"
            disabled={isMaxYear}
            onClick={incrementPlanYear}
          >
            <ChevronRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
