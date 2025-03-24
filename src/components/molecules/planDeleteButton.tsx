import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { type Plan } from "@/utils/interfaces";
import { LoadingButton } from "./loadingButton";
import { useState } from "react";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { useEditPlan } from "@/hooks/useEditPlan";
import { useAdminSettings } from "@/hooks/useAdminSettings";

type PlanDeleteButtonProps = {
  plan: Plan;
};

export const PlanDeleteButton = ({ plan }: PlanDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deletePlan } = useEditPlan();
  const { isPlanEditLocked } = useAdminSettings();

  const handleDelete = async () => {
    deletePlan.mutate(plan.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
      onError: () => {
        setIsOpen(false);
      },
    });
  };

  const isCurrentYear = plan.year === CURRENT_YEAR;
  const isDisabled = isCurrentYear || isPlanEditLocked;

  return (
    <Dialog onOpenChange={() => setIsOpen((prev) => !prev)} open={isOpen}>
      <DialogTrigger disabled={isDisabled}>
        <Tooltip>
          <TooltipTrigger
            asChild
            className={isDisabled ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              size={"icon"}
              variant="ghost"
              className="rounded-full text-primary/60 hover:text-primary"
              disabled={isDisabled}
              asChild
            >
              <Trash className="p-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Radera planering</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Är du helt säker?</DialogTitle>
          <DialogDescription>
            Om du raderar planeringen <b>{plan.label}</b> kommer den att tas
            bort permanent. Det går inte att ångra denna åtgärd.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Avbryt</Button>
          </DialogClose>
          <LoadingButton loading={deletePlan.isPending} onClick={handleDelete}>
            Radera
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
