import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useChangePassword } from "@hooks/useChangePassword";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { LoadingButton } from "../ui/loading-button";

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "change_password_dialog.error.current_password_required"),
    newPassword: z
      .string()
      .min(8, "change_password_dialog.error.new_password_min"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "change_password_dialog.error.confirm_password_match",
    path: ["confirmPassword"],
  });

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  const { t } = useTranslation();
  const { changePassword, isPending } = useChangePassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    changePassword(values.currentPassword, values.newPassword).then(() => {
      form.reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{t("change_password_dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("change_password_dialog.description")}
            </DialogDescription>
          </DialogHeader>

          <Controller
            control={form.control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("change_password_dialog.current_password")}
                </FieldLabel>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("change_password_dialog.new_password")}
                </FieldLabel>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("change_password_dialog.confirm_password")}
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <LoadingButton type="submit" loading={isPending} className="mt-4">
              {t("change_password_dialog.submit")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
