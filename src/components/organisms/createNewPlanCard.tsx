import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useCreatePlan } from "@hooks/useCreatePlan";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { CURRENT_YEAR } from "@utils/CONSTANTS";
import { Button } from "@ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
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
import { LoadingButton } from "../molecules/loadingButton";

const formSchema = z.object({
  planName: z.string().min(1, "Du måste ange ett namn för planeringen"),
});

export const CreateNewPlanCard = () => {
  const { createPlan, isPending } = useCreatePlan();
  const { planYear } = useStorePlanYear();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createPlan({
      planName: values.planName,
      onSettled: () => form.reset(),
    });
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>{t("create_new_plan.title")}</CardTitle>
        <CardDescription className="max-w-lg leading-relaxed text-balance">
          {t("create_new_plan.description")}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild disabled={planYear < CURRENT_YEAR}>
            <Button disabled={planYear < CURRENT_YEAR}>
              {t("create_new_plan.dialog_title")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <DialogHeader>
                  <DialogTitle>{t("create_new_plan.dialog_title")}</DialogTitle>
                  <DialogDescription>
                    {t("create_new_plan.dialog_description")}
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input
                          id="plan-name"
                          type="text"
                          placeholder={t("create_new_plan.dialog_placeholder")}
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
                    loading={isPending}
                    className="mt-4"
                  >
                    {t("create")}
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
