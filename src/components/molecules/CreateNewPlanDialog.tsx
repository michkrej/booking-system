import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { useCreatePlan } from "@/hooks/useCreatePlan";
import { useStoreUser } from "@/hooks/useStoreUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoadingButton } from "../ui/loading-button";

const formSchema = z.object({
  planName: z.string().min(1, "Du måste ange ett namn för planeringen"),
});

export const CreateNewPlanDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { user } = useStoreUser();
  const { createPlan, isPending: isCreating } = useCreatePlan();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: user.committee?.name ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createPlan(values.planName, {
      onSettled: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{t("create_new_plan.dialog_title")}</DialogTitle>
            <DialogDescription>
              {t("create_new_plan.dialog_description")}
            </DialogDescription>
          </DialogHeader>
          <Controller
            control={form.control}
            name="planName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("name")}</FieldLabel>
                <Input
                  id="plan-name"
                  type="text"
                  placeholder={t("create_new_plan.dialog_placeholder")}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <LoadingButton type="submit" loading={isCreating} className="mt-4">
              {t("create")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
