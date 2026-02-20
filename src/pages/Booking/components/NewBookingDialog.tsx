import { zodResolver } from "@hookform/resolvers/zod";
import { sv } from "date-fns/locale";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { type z } from "zod";
import { useBookingActions } from "@hooks/useBookingActions";
import { useStoreBookings } from "@hooks/useStoreBookings";
import { useStoreUser } from "@hooks/useStoreUser";
import { corridorsC } from "@data/campusValla/rooms";
import roomsC from "@data/campusValla/rooms/C";
import { committees } from "@data/committees";
import { campusLocationsMap } from "@data/locationsData";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { DateTimePicker } from "@ui/date-time-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { MultiSelect } from "@ui/multi-select";
import { Separator } from "@ui/separator";
import { LoadingButton } from "@/components/ui/loading-button";
import { type Booking, type NewBooking } from "@/interfaces/interfaces";
import { viewCollisionsPath, viewPath } from "@/utils/constants";
import { AddBookableItemDropdown } from "./AddBookableItemDropdown";
import { BookableItemEntry } from "./BookableItemEntry";
import { ScheduleContext } from "./ScheduleContext";
import { BookingSchema, type BookingSchemaInput } from "./schema";

type EditorTemplateProps = {
  data?: NewBooking;
  open: boolean;
  onOpenChange: () => void;
};

export const NewBookingDialog = ({
  data,
  open,
  onOpenChange,
}: EditorTemplateProps) => {
  const { id: planId = "" } = useParams();
  const { createdBooking } = useStoreBookings();
  const { rooms, activePlans, building } = useContext(ScheduleContext);
  const { user } = useStoreUser();
  const { addBookingToPlanMutation } = useBookingActions();
  const [roomOptions, setRoomOptions] = useState<
    { label: string; value: string }[]
  >(
    rooms.map((room) => ({
      value: room.id,
      label: room.name,
    })),
  );

  const disabledForm = planId === viewPath || planId === viewCollisionsPath;

  const form = useForm({
    resolver: zodResolver(BookingSchema),
    disabled: disabledForm,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bookableItems",
  });

  useEffect(() => {
    setRoomOptions(rooms.map((room) => ({ value: room.id, label: room.name })));
  }, [building]);

  // Fixes bug where an extra bookable item is added when the form is reset
  useLayoutEffect(() => {
    // if any of the bookable items contains a undefined value, remove it
    fields.forEach((item, i) => {
      if (item.value === undefined) {
        remove(i);
      }
    });
  }, [fields]);

  useEffect(() => {
    if (!data) {
      return;
    }

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
      bookableItems: [],
      link: "",
    });
  }, [data]);

  async function onSubmit(values: z.infer<typeof BookingSchema>) {
    if (!planId) return;
    const bookingData = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      alcohol: values.alcohol,
      food: values.food,
      allDay: false,
      committeeId: user.committeeId,
      planId: planId,
      locationId: building!.id,
      roomId: values.rooms.map((room) => room.value),
      link: values.link,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookableItems: values?.bookableItems,
    } satisfies Booking;

    await addBookingToPlanMutation.mutateAsync(
      {
        booking: bookingData,
        plan: activePlans.find((plan) => plan.id === planId) ?? null,
      },
      {
        onSuccess: () => {
          createdBooking(bookingData);
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
    // Type assertion needed because useFieldArray uses output types,
    // but we're providing input values that will be transformed
    append({
      key: itemName,
      value: "",
      startDate: form.getValues("startDate") ?? new Date(),
      endDate: form.getValues("endDate") ?? new Date(),
    } as unknown as (typeof fields)[number]);

    fields.forEach((item, i) => {
      if (item.value === undefined) {
        remove(i);
      }
    });
  };

  const removeBookableItem = (
    item: NonNullable<BookingSchemaInput["bookableItems"]>[number],
  ) => {
    const index = fields.findIndex((i) => i.key === item.key);
    if (index === -1) return;

    remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-3rem)] sm:max-w-9/12 flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lägg till bokning</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form
          className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-x-4 text-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="row-span-1 grid grid-cols-2 gap-x-4 gap-y-2 pb-40">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-full"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel>Aktivitet</FieldLabel>
                  <Input
                    id="newPlanName"
                    type="text"
                    placeholder="Ange aktivitet"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-full"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel>Beskrivning</FieldLabel>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Ange beskrivning"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Startdatum</FieldLabel>
                  <DateTimePicker
                    {...field}
                    value={field.value as Date}
                    locale={sv}
                    weekStartsOn={1}
                    granularity="minute"
                    hourCycle={24}
                    yearRange={0}
                    placeholder="Startdatum"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Slutdatum</FieldLabel>
                  <DateTimePicker
                    {...field}
                    value={field.value as Date}
                    locale={sv}
                    weekStartsOn={1}
                    granularity="minute"
                    hourCycle={24}
                    yearRange={0}
                    placeholder="Slutdatum"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Label>Fadderi</Label>
              <Input
                disabled
                value={committees[user.committeeId]?.name ?? ""}
              />
            </Field>

            <Field>
              <Label>Byggnad</Label>
              <Input disabled value={building?.name ?? "Välj byggnad"} />
            </Field>

            <Controller
              name="rooms"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field
                    className="col-span-full"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel>Rum</FieldLabel>
                    <MultiSelect
                      {...field}
                      onChange={onRoomsSelect}
                      options={roomOptions}
                      placeholder="Välj rum"
                      emptyIndicator="Inga rum hittades"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <div className="col-span-full my-2 flex justify-center gap-x-4">
              <Controller
                name="food"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    className="h-5 w-auto items-center justify-center gap-x-2"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabledForm}
                    />
                    <FieldLabel>Mat?</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="alcohol"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    className="h-5 w-auto items-center justify-center gap-x-2"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabledForm}
                    />
                    <FieldLabel>Alkohol?</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="link"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-full"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel>
                    Google Maps länk till plats (t.ex. för hajk eller
                    stadsvandring)
                  </FieldLabel>
                  <Input id="link" type="text" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Separator orientation="vertical" className="row-span-3" />
          <section className="row-span-3 mt-1 flex flex-col gap-y-4">
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
      </DialogContent>
    </Dialog>
  );
};
