import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useEditPlan } from "@hooks/useEditPlan";
import { type Plan } from "@utils/interfaces";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { LoadingButton } from "./loadingButton";

const formSchema = z.object({
  newPlanName: z.string().min(1, "Du måste ange ett nytt namn för planeringen"),
});

type ChangePlanNameModalProps = {
  plan: Plan;
};

export const PlanChangeNameButton = ({ plan }: ChangePlanNameModalProps) => {
  const { updatePlanName } = useEditPlan();
  const [open, setOpen] = useState(false);
  const { isPlanEditLocked } = useAdminSettings();
  const { t } = useTranslation();

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
                <Pencil />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{t("change_plan_name")}</DialogTitle>
              <DialogDescription>
                {t("update_plan_name_for_plan_x", { x: plan.label })}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="newPlanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      id="plan-name"
                      type="text"
                      placeholder={t("update_plan_name_for_plan_x", {
                        x: plan.label,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
