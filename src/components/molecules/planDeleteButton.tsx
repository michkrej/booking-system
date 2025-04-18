import { Trash } from "lucide-react";
import { useState } from "react";

import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";

import { type Plan } from "@utils/interfaces";

import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";

import { LoadingButton } from "./loadingButton";

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

  return (
    <Dialog onOpenChange={() => setIsOpen((prev) => !prev)} open={isOpen}>
      <DialogTrigger disabled={isPlanEditLocked}>
        <Tooltip>
          <TooltipTrigger
            asChild
            className={isPlanEditLocked ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              size={"icon"}
              variant="ghost"
              className="text-primary/60 hover:text-primary rounded-full"
              disabled={isPlanEditLocked}
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
