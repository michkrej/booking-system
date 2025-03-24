import { type Plan } from "@/utils/interfaces";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Globe, GlobeLock, Loader } from "lucide-react";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { Button } from "../ui/button";
import { useEditPlan } from "@/hooks/useEditPlan";
import { useAdminSettings } from "@/hooks/useAdminSettings";

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
  const { isPlanEditLocked } = useAdminSettings();

  const isCurrentYear = plan.year === CURRENT_YEAR;
  const isDisabled = isCurrentYear || isPlanEditLocked;

  return (
    <Tooltip>
      <TooltipTrigger
        disabled={isDisabled}
        className={isDisabled ? "pointer-events-none opacity-50" : ""}
      >
        <Button
          size={"icon"}
          variant="ghost"
          className="rounded-full text-primary/60 hover:text-primary"
          disabled={isDisabled}
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
