import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useCreatePlan } from "@hooks/useCreatePlan";
import { useStorePlanYear } from "@hooks/useStorePlanYear";
import { CURRENT_YEAR } from "@utils/CONSTANTS";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
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
import { Skeleton } from "@ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { usePlansListCard } from "@/hooks/usePlansListCard";
import { useUserPlanConflicts } from "@/hooks/useUserPlanConflicts";
import { UserPlansListRow } from "../molecules/UserPlansListRow";
import { LoadingButton } from "../molecules/loadingButton";

const loadingTableEntries = Array.from({ length: 1 }, (_, i) => i);

const formSchema = z.object({
  planName: z.string().min(1, "Du måste ange ett namn för planeringen"),
});

interface UserPlansListCardProps {
  showCreateButton?: boolean;
}

export const UserPlansListCard = ({
  showCreateButton = true,
}: UserPlansListCardProps) => {
  const { t } = useTranslation();
  const { userPlans, isPending, handlePlanClick } = usePlansListCard();
  const { getConflictsForPlan } = useUserPlanConflicts();
  const { createPlan, isPending: isCreating } = useCreatePlan();
  const { planYear } = useStorePlanYear();

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

  const canCreatePlan = showCreateButton && planYear >= CURRENT_YEAR;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("your_plans")}</CardTitle>
        {canCreatePlan && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex gap-x-1">
                <PlusIcon className="size-4" />{" "}
                <span className="hidden md:inline">Ny planering</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <DialogHeader>
                    <DialogTitle>
                      {t("create_new_plan.dialog_title")}
                    </DialogTitle>
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
                            placeholder={t(
                              "create_new_plan.dialog_placeholder",
                            )}
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
                      loading={isCreating}
                      className="mt-4"
                    >
                      {t("create")}
                    </LoadingButton>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("num_bookings")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead>Krockar</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("updated")}
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isPending ? (
              userPlans.length > 0 ? (
                userPlans.map((plan) => (
                  <UserPlansListRow
                    key={plan.id}
                    plan={plan}
                    conflicts={getConflictsForPlan(plan.id)}
                    onPlanClick={handlePlanClick}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    {t("you_do_not_have_any_plans_yet")}
                  </TableCell>
                </TableRow>
              )
            ) : (
              loadingTableEntries.map((index) => (
                <TableRow key={`table-row-${index}`}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
