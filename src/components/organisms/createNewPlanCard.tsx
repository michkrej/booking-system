import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingButton } from "../molecules/loadingButton";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useStoreBookings } from "@/hooks/useStoreBookings";
import { useEditPlan } from "@/hooks/useEditPlan";
import { useBoundStore } from "@/state/store";
import { useStorePlanYear } from "@/hooks/useStorePlanYear";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

const formSchema = z.object({
  planName: z.string().min(1, "Du måste ange ett namn för planeringen"),
});

export const CreateNewPlanCard = () => {
  const { createPlan } = useEditPlan();
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const bookings = useStoreBookings();
  const navigate = useNavigate();
  const { planYear } = useStorePlanYear();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createPlan.mutate(values.planName, {
      onSuccess: (newPlan) => {
        bookings.loadedBookings([]);
        changedActivePlans([newPlan]);
        navigate(`/booking/${newPlan.id}`);
        form.reset();
      },
      onError: () => {
        form.reset();
      },
    });
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Planeringar</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          En planering kan ses som en google calender, den kan innehålla flera
          event som sker på olika platser.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild disabled={planYear < CURRENT_YEAR}>
            <Button disabled={planYear < CURRENT_YEAR}>
              Skapa ny planering
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <DialogHeader>
                  <DialogTitle>Skapa ny planering</DialogTitle>
                  <DialogDescription>
                    En planering kan ses som en google calender, den kan
                    innehålla flera event som sker på olika platser.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="planName"
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
                    loading={createPlan.isPending}
                    className="mt-4"
                  >
                    Skapa
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
