import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { type Plan } from "@/interfaces/interfaces";
import { LoadingButton } from "../ui/loading-button";

const formSchema = z.object({
  newPlanName: z.string().min(1, "Du måste ange ett nytt namn för planeringen"),
});

type ChangePlanNameModalProps = {
  plan: Plan;
};

export const PlanChangeNameButton = ({ plan }: ChangePlanNameModalProps) => {
  const { t } = useTranslation();

  const { updatePlanName } = useEditPlan();
  const { isPlanEditLocked } = useAdminSettings();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPlanName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePlanName.mutate(
      { plan, newPlanName: values.newPlanName },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger disabled={isPlanEditLocked}>
        <Tooltip>
          <TooltipTrigger
            asChild
            className={isPlanEditLocked ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              size={"icon"}
              variant="ghost"
              className="text-primary/60 hover:text-primary rounded-full p-2"
              disabled={isPlanEditLocked}
              asChild
            >
              <div>
                <Pencil className="size-5 sm:size-6" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("change_plan_name")}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{t("change_plan_name")}</DialogTitle>
            <DialogDescription>
              {t("update_plan_name_for_plan_x", { x: plan.label })}
            </DialogDescription>
          </DialogHeader>
          <Controller
            control={form.control}
            name="newPlanName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("name")}</FieldLabel>
                <Input
                  id="plan-name"
                  type="text"
                  placeholder={t("update_plan_name_for_plan_x", {
                    x: plan.label,
                  })}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <LoadingButton
              type="submit"
              loading={updatePlanName.isPending}
              className="mt-4"
            >
              {t("create")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
