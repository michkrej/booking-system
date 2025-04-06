import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { sv } from "date-fns/locale";
import { committees } from "@/data/committees";
import { type Booking, type BookableItem } from "@/utils/interfaces";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@/components/molecules/loadingButton";
import { useStoreBookings } from "@/hooks/useStoreBookings";
import { useStoreUser } from "@/hooks/useStoreUser";
import { Checkbox } from "@/components/ui/checkbox";
import { campusLocationsMap } from "@/data/locationsData";
import { useBookingActions } from "@/hooks/useBookingActions";
import { corridorsC } from "@/data/campusValla/rooms";
import roomsC from "@/data/campusValla/rooms/C";
import { Separator } from "@/components/ui/separator";
import { AddBookableItemDropdown } from "./AddBookableItemDropdown";
import { BookableItemEntry } from "./BookableItemEntry";
import { BookingSchema } from "./schema";
import { convertToDate } from "@/lib/utils";
import { ScheduleContext } from "./ScheduleContext";

type EditorTemplateProps = {
  data?: Booking;
  open: boolean;
  onOpenChange: () => void;
};

export const EditBookingDialog = ({
  data,
  open,
  onOpenChange,
}: EditorTemplateProps) => {
  const { id: planId = "" } = useParams();
  const { updatedBooking } = useStoreBookings();
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

    return (
      Object.values(campusLocationsMap[chosenCampus]).find(
        (entry) => entry.id === data?.locationId,
      ) ?? dropDownBuilding
    );
  }, [dropDownBuilding, data, chosenCampus]);

  const currentPlan = useMemo(() => {
    return activePlans.find((plan) => plan.id === data?.planId) ?? null;
  }, [activePlans, data, planId]);

  const disabledForm = currentPlan?.userId !== user.id;

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    disabled: disabledForm,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "bookableItems",
  });

  useEffect(() => {
    if (!data) {
      replace([]);
      return;
    }

    form.reset({
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      rooms: data.roomId.map((roomId) => ({
        value: roomId,
        label: rooms.find((room) => room.id === roomId)?.name ?? "",
      })),
      food: data.food,
      alcohol: data.alcohol,
      bookableItems: data.bookableItems.map((item) => ({
        ...item,
        startDate: convertToDate(item.startDate),
        endDate: convertToDate(item.endDate),
      })),
      link: data.link ?? "",
    });
  }, [data]);

  async function onSubmit(values: z.infer<typeof BookingSchema>) {
    if (!planId) return;
    if (!data) return;
    const bookingData = {
      id: data.id,
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      alcohol: values.alcohol,
      food: values.food,
      allDay: false,
      committeeId: data?.committeeId ?? user.committeeId,
      planId: data.planId,
      locationId: building!.id,
      roomId: values.rooms.map((room) => room.value),
      link: values.link,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookableItems: values.bookableItems,
    } satisfies Booking;

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

  const onRoomsSelect = (selectedRooms: { label: string; value: string }[]) => {
    // Reset room options if not in "C-huset" or no rooms are selected
    if (
      building?.id !== campusLocationsMap.Valla["C-huset"].id ||
      selectedRooms.length === 0
    ) {
      setRoomOptions(
        rooms.map((room) => ({ value: room.id, label: room.name })),
      );
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

  const addBookableItemToBooking = (itemName: string) => {
    append({
      key: itemName,
      value: "",
      startDate: form.getValues("startDate"),
      endDate: form.getValues("endDate"),
    });
  };

  const removeBookableItem = (item: BookableItem) => {
    const index = fields.findIndex((i) => i.key === item.key);
    if (index === -1) return;

    remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-50px)] max-w-[1200px] flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redigera bokning</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid grid-cols-[1fr_1px_1fr] gap-x-4 text-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="row-span-1 grid grid-cols-2 gap-x-4 gap-y-2 pb-40">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-full space-y-0">
                    <FormLabel>Aktivitet</FormLabel>
                    <FormControl>
                      <Input
                        id="newPlanName"
                        type="text"
                        placeholder="Ange aktivitet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-full space-y-0">
                    <FormLabel>Beskrivning</FormLabel>
                    <FormControl>
                      <Input
                        id="description"
                        type="text"
                        placeholder="Ange beskrivning"
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
                        placeholder="Startdatum"
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
                        placeholder="Slutdatum"
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
                  value={data ? committees[data.committeeId].name : "??"}
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
                      <FormLabel className="mt-0!">Mat?</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="alcohol"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="m-0! flex h-5 items-center justify-center gap-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={disabledForm}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Alkohol?</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            </div>
            <Separator orientation="vertical" className="row-span-3" />
            <section className="row-span-3 mt-5 flex flex-col gap-y-4">
              <AddBookableItemDropdown
                addBookableItemToBooking={addBookableItemToBooking}
                bookableItems={fields}
              />
              <div className="flex max-h-[calc(100vh-300px)] flex-col gap-y-4 overflow-y-auto">
                {(fields || []).map((item, index) => {
                  return (
                    <BookableItemEntry
                      item={item}
                      key={item.id}
                      handleDelete={() => removeBookableItem(item)}
                      form={form}
                      index={index}
                    />
                  );
                })}
              </div>
            </section>
            <DialogFooter className="col-span-full mt-4">
              <LoadingButton
                type="submit"
                loading={addBookingToPlanMutation.isPending}
                disabled={disabledForm}
              >
                Spara
              </LoadingButton>
              <DialogClose asChild>
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
