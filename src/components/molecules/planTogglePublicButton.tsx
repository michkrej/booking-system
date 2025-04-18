import { Globe, GlobeLock, Loader } from "lucide-react";

import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";

import { type Plan } from "@utils/interfaces";

import { Button } from "@ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";

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

  return (
    <Tooltip>
      <TooltipTrigger
        disabled={isPlanEditLocked}
        className={isPlanEditLocked ? "pointer-events-none opacity-50" : ""}
      >
        <Button
          size={"icon"}
          variant="ghost"
          className="text-primary/60 hover:text-primary rounded-full"
          disabled={isPlanEditLocked}
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
