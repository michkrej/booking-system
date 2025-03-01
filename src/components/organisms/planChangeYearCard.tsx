import { usePlanYear, usePlanYearActions } from "@/state";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMemo } from "react";
import { MAX_YEAR, MIN_YEAR } from "@/state/planStoreSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PlanChangeYearCard = () => {
  const { planYear } = usePlanYear();
  const { incrementPlanYear, decrementPlanYear } = usePlanYearActions();

  const isMaxYear = useMemo(() => planYear >= MAX_YEAR, [planYear]);
  const isMinYear = useMemo(() => planYear <= MIN_YEAR, [planYear]);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-7">
        <CardDescription>Planeringar för året</CardDescription>
        <CardTitle>{planYear}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end gap-x-4 pb-4">
        <div className="text-xs text-muted-foreground">Byt år:</div>
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
