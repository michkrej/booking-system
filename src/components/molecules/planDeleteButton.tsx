import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";
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
import { type Plan } from "@/interfaces/interfaces";
import { LoadingButton } from "../ui/loading-button";

type PlanDeleteButtonProps = {
  plan: Plan;
};

export const PlanDeleteButton = ({ plan }: PlanDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deletePlan } = useEditPlan();
  const { isPlanEditLocked } = useAdminSettings();
  const { t } = useTranslation();

  const handleDelete = async () => {
    deletePlan.mutate(plan.id, {
      onSettled: () => {
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
              <div>
                <TrashIcon className="size-5 sm:size-6" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("delete_dialog.tooltip")}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete_dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("delete_dialog.description", { x: plan.label })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">{t("cancel")}</Button>
          </DialogClose>
          <LoadingButton loading={deletePlan.isPending} onClick={handleDelete}>
            {t("delete")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
