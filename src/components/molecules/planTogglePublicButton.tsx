import { Globe, GlobeLock, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";
import { Button } from "@ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { type Plan } from "@/interfaces/interfaces";

type PlanTogglePublicButtonProps = {
  plan: Plan;
};

const getIcon = (pending: boolean, isPublic: boolean) => {
  if (pending) return <Loader className="animate-spin sm:size-6 size-5" />;
  if (isPublic) return <GlobeLock className="size-5 sm:size-6" />;
  return <Globe className="size-5 sm:size-6" />;
};

export const PlanTogglePublicButton = ({
  plan,
}: PlanTogglePublicButtonProps) => {
  const { togglePublicPlan } = useEditPlan();
  const { isPlanEditLocked } = useAdminSettings();
  const { t } = useTranslation();

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
          <div>{getIcon(togglePublicPlan.isPending, plan.public)}</div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {plan.public ? t("make_plan_private") : t("make_plan_public")}
      </TooltipContent>
    </Tooltip>
  );
};
