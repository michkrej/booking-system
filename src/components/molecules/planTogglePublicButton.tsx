import { type Plan } from "@/utils/interfaces";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Globe, GlobeLock, Loader } from "lucide-react";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { Button } from "../ui/button";
import { useEditPlan } from "@/hooks/useEditPlan";

type PlanTogglePublicButtonProps = {
  plan: Plan;
};

const getIcon = (pending: boolean, isPublic: boolean) => {
  if (pending) return <Loader className="animate-spin p-2" />;
  if (isPublic) return <GlobeLock className="p-2" />;
  return <Globe className="p-2" />;
};

export const PlanTogglePublicButton = ({
  plan,
}: PlanTogglePublicButtonProps) => {
  const { togglePublicPlan } = useEditPlan();

  const isCurrentYear = plan.year === CURRENT_YEAR;

  return (
    <Tooltip>
      <TooltipTrigger
        disabled={!isCurrentYear}
        className={!isCurrentYear ? "pointer-events-none" : ""}
      >
        <Button
          size={"icon"}
          variant="ghost"
          className="rounded-full text-primary/60 hover:text-primary"
          disabled={!isCurrentYear}
          onClick={() => togglePublicPlan.mutate(plan)}
          asChild
        >
          {getIcon(togglePublicPlan.isPending, plan.public)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Gör planering {`${plan.public ? "privat" : "publik"}`}
      </TooltipContent>
    </Tooltip>
  );
};
