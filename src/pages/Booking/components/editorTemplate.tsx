import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { MultiSelect } from "@/components/ui/multi-select";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { sv } from "date-fns/locale";
import { ScheduleContext } from "./Schedule";
import { committees } from "@/data/committees";
import { type NewBooking, type Booking } from "@/utils/interfaces";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@/components/molecules/loadingButton";
import { useStoreBookings } from "@/hooks/useStoreBookings";
import { useStoreUser } from "@/hooks/useStoreUser";
import { Checkbox } from "@/components/ui/checkbox";
import { campusLocationsMap } from "@/data/locationsData";
import { useBookingActions } from "@/hooks/useBookingActions";
import { corridorsC } from "@/data/campusValla/rooms";
import roomsC from "@/data/campusValla/rooms/C";

const formSchema = z.object({
  title: z.string().min(1, "Bokningen måste ha ett namn"),
  startDate: z.date(),
  endDate: z.date(),
  rooms: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "Bokningen måste ha minst en rum"),
  food: z.boolean(),
  alcohol: z.boolean(),
  "bankset-k": z.coerce.number(),
  "bankset-hg": z.coerce.number(),
  "bankset-hoben": z.coerce.number(),
  grillar: z.coerce.number(),
  bardiskar: z.coerce.number(),
  scenes: z.coerce.number(),
  "ff-tents": z.coerce
    .number()
    .min(0)
    .max(4, "Det finns bara fyra tält att låna"),
  "ff-elverk": z.coerce
    .number()
    .min(0)
    .max(1, "Det finns bara ett elverk att låna"),
  "ff-trailer": z.coerce
    .number()
    .min(0)
    .max(1, "Det finns bara en trailer att låna"),
  "other-inventory": z.string(),
  link: z.string(),
});

type EditorTemplateProps = (
  | {
      action: "create";
      data?: NewBooking;
    }
  | {
      action: "edit";
      data?: Booking;
    }
) & {
  open: boolean;
  onOpenChange: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditorTemplate = ({
  action,
  data,
  open,
  onOpenChange,
}: EditorTemplateProps) => {
  const { id: planId = "" } = useParams();
  const { createdBooking, updatedBooking } = useStoreBookings();
  const {
    rooms,
    activePlans,
    building: dropDownBuilding,
    chosenCampus,
  } = useContext(ScheduleContext);
  const { user } = useStoreUser();
  const { addBookingToPlanMutation, updateBookingMutation } =
    useBookingActions();
  const [roomOptions, setRoomOptions] = useState<
    { label: string; value: string }[]
  >(
    rooms.map((room) => ({
      value: room.id,
      label: room.name,
    })),
  );

  const building = useMemo(() => {
    setRoomOptions(rooms.map((room) => ({ value: room.id, label: room.name })));

    if (action === "create") return dropDownBuilding;

    return (
      Object.values(campusLocationsMap[chosenCampus]).find(
        (entry) => entry.id === data?.locationId,
      ) ?? dropDownBuilding
    );
  }, [dropDownBuilding, action, data, chosenCampus]);

  const currentPlan = useMemo(() => {
    if (action === "create") {
      return activePlans.find((plan) => plan.id === planId) ?? null;
    }

    return activePlans.find((plan) => plan.id === data?.planId) ?? null;
  }, [activePlans, planId, data]);

  const disabledForm = planId === "view";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: disabledForm,
  });

  // Reset form values when `data` is available
  useEffect(() => {
    if (!data) return;
    if (action === "create") {
      form.reset({
        title: "",
        startDate: data.startDate,
        endDate: data.endDate,
        rooms: [
          {
            value: data.roomId,
            label: rooms.find((room) => room.id === data.roomId)?.name ?? "",
          },
        ],
        food: false,
        alcohol: false,
        "bankset-k": 0,
        "bankset-hg": 0,
        "bankset-hoben": 0,
        grillar: 0,
        bardiskar: 0,
        scenes: 0,
        "ff-tents": 0,
        "ff-elverk": 0,
        "ff-trailer": 0,
        "other-inventory": "",
        link: "",
      });
    } else {
      form.reset({
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        rooms: data.roomId.map((roomId) => ({
          value: roomId,
          label: rooms.find((room) => room.id === roomId)?.name ?? "",
        })),
        food: data.food,
        alcohol: data.alcohol,
        "bankset-k": data["bankset-k"] ?? 0,
        "bankset-hg": data["bankset-hg"] ?? 0,
        "bankset-hoben": data["bankset-hoben"] ?? 0,
        grillar: data.grillar ?? 0,
        bardiskar: data.bardiskar ?? 0,
        scenes: data.scenes ?? 0,
        "ff-tents": data["ff-tents"] ?? 0,
        "ff-elverk": data["ff-elverk"] ?? 0,
        "ff-trailer": data["ff-trailer"] ?? 0,
        "other-inventory": data.annat,
        link: data.link ?? "",
      });
    }
  }, [data, form.reset]); // Depend on `data` and `reset` to update values when `data` changes

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!planId) return;
    const bookingData = {
      id: action === "create" ? uuidv4() : (data?.id ?? uuidv4()),
      title: values.title,
      startDate: values.startDate,
      endDate: values.endDate,
      alcohol: values.alcohol,
      food: values.food,
      allDay: false,
      committeeId: user.committeeId,
      planId: action === "create" ? planId : (data?.planId ?? "??"),
      locationId: building!.id,
      roomId: values.rooms.map((room) => room.value),
      grillar: values.grillar,
      bardiskar: values.bardiskar,
      scenes: values.scenes,
      "bankset-hg": values["bankset-hg"],
      "bankset-k": values["bankset-k"],
      "bankset-hoben": values["bankset-hoben"],
      "ff-trailer": values["ff-trailer"],
      "ff-tents": values["ff-tents"],
      "ff-elverk": values["ff-elverk"],
      annat: values["other-inventory"],
      link: values.link,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies Booking;

    if (action === "create") {
      await addBookingToPlanMutation.mutateAsync(
        {
          booking: bookingData,
          plan: currentPlan,
        },
        {
          onSuccess: () => {
            createdBooking(bookingData);
            onOpenChange();
          },
        },
      );
    } else {
      await updateBookingMutation.mutateAsync(
        {
          booking: bookingData,
          plan: currentPlan,
        },
        {
          onSuccess: () => {
            updatedBooking(bookingData);
            onOpenChange();
          },
        },
      );
    }
  }

  const onRoomsSelect = (selectedRooms: { label: string; value: string }[]) => {
    // Reset room options if not in "C-huset" or no rooms are selected
    if (
      building?.id !== campusLocationsMap.Valla["C-huset"].id ||
      selectedRooms.length === 0
    ) {
      setRoomOptions(
        rooms.map((room) => ({ value: room.id, label: room.name })),
      );
      return;
    }

    const corridors = new Set<string>(
      Object.values(corridorsC).map((c) => c.id),
    );
    const selectedCorridorIds = new Set<string>();

    // Use a Map to prevent duplicates (key = room ID)
    const updatedRoomSelection = new Map<
      string,
      { label: string; value: string }
    >();

    selectedRooms.forEach((entry) => {
      if (corridors.has(entry.value)) {
        selectedCorridorIds.add(entry.value);

        // Add all rooms in the selected corridor
        roomsC
          .filter((room) => room.corridorId === entry.value)
          .forEach((room) =>
            updatedRoomSelection.set(room.id, {
              value: room.id,
              label: room.name,
            }),
          );
      } else {
        updatedRoomSelection.set(entry.value, entry);
      }
    });

    form.setValue("rooms", Array.from(updatedRoomSelection.values()));
    setRoomOptions((prevOptions) =>
      prevOptions.filter((room) => !selectedCorridorIds.has(room.value)),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-50px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lägg till bokning</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-x-3 gap-y-2 overflow-y-auto overflow-x-hidden px-1 text-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>Akivitet</FormLabel>
                  <FormControl>
                    <Input
                      id="newPlanName"
                      type="text"
                      placeholder="Ange ett namn för planeringen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Startdatum</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      locale={sv}
                      weekStartsOn={1}
                      granularity="minute"
                      hourCycle={24}
                      yearRange={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Slutdatum</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      locale={sv}
                      weekStartsOn={1}
                      granularity="minute"
                      hourCycle={24}
                      yearRange={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Fadderi</Label>
              <Input
                disabled
                value={
                  action === "edit"
                    ? data
                      ? committees[data.committeeId].name
                      : "??"
                    : committees[user.committeeId].name
                }
              />
            </div>
            <div>
              <Label>Byggnad</Label>
              <Input disabled value={building?.name ?? "Välj byggnad"} />
            </div>
            <FormField
              name="rooms"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-full space-y-0">
                    <FormLabel>Rum</FormLabel>
                    <MultiSelect
                      {...field}
                      onChange={onRoomsSelect}
                      options={roomOptions}
                      placeholder="Välj rum"
                      emptyIndicator="Inga rum hittades"
                    />
                  </FormItem>
                );
              }}
            />
            <div className="col-span-full my-2 flex justify-center gap-x-4">
              <FormField
                name="food"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex h-5 items-center justify-center gap-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabledForm}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Mat?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="alcohol"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="!m-0 flex h-5 items-center justify-center gap-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabledForm}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Alkohol?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full grid grid-cols-3 gap-x-4">
              <FormField
                name="bankset-k"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="bankset-k" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankset-hg"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (HG)</FormLabel>
                    <FormControl>
                      <Input id="bankset-hg" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankset-hoben"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (Hoben)</FormLabel>
                    <FormControl>
                      <Input id="bankset-hoben" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full grid grid-cols-3 gap-x-4 gap-y-2">
              <FormField
                name="grillar"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Grillar (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="grillar" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bardiskar"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bardiskar (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="bardiskar" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="scenes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Scenpodier (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="scenes" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-tents"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Tält (FF)</FormLabel>
                    <FormControl>
                      <Input id="ff-tents" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-elverk"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Elverk (FF)</FormLabel>
                    <FormControl>
                      <Input id="ff-elverk" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-trailer"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Släp (FF)</FormLabel>
                    <FormControl>
                      <Input id="ff-trailer" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="other-inventory"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>Övriga inventarier för bokningen</FormLabel>
                  <FormControl>
                    <Textarea id="other-inventory" rows={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>
                    Google Maps länk till plats (t.ex. för hajk eller
                    stadsvandring)
                  </FormLabel>
                  <FormControl>
                    <Input id="link" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-full">
              <LoadingButton
                type="submit"
                loading={addBookingToPlanMutation.isPending}
                disabled={disabledForm}
              >
                Spara
              </LoadingButton>
              <DialogClose>
                <Button variant="outline" type="button">
                  Avbryt
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
