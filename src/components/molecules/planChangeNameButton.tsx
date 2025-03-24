import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Plan } from "@/utils/interfaces";
import { useState } from "react";
import { LoadingButton } from "./loadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { useEditPlan } from "@/hooks/useEditPlan";
import { useAdminSettings } from "@/hooks/useAdminSettings";

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
              className="rounded-full p-2 text-primary/60 hover:text-primary"
              disabled={isPlanEditLocked}
              asChild
            >
              <div>
                <Pencil />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Byt namn på planering</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Byt namn på planering</DialogTitle>
              <DialogDescription>
                Ange ett nytt namn för planeringen <strong>{plan.label}</strong>
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="newPlanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input
                      id="plan-name"
                      type="text"
                      placeholder="Ange ett namn för planeringen"
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
                Skapa
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
