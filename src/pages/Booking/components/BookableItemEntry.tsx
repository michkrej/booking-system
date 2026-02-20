import { sv } from "date-fns/locale";
import { TrashIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@ui/button";
import { Comment } from "@ui/comment";
import { DateTimePicker } from "@ui/date-time-picker";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";
import {
  type BookableItemInput,
  type BookingSchemaOutput,
} from "./schema";

type InventoryItemProps = {
  item: BookableItemInput & { id: string };
  index: number;
  handleDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<BookingSchemaOutput, any, any>;
};

export const BookableItemEntry = ({
  item,
  handleDelete,
  index,
  form,
}: InventoryItemProps) => {
  const optionData = BOOKABLE_ITEM_OPTIONS.find(
    (option) => option.key === item.key,
  );

  if (!optionData) return null;

  return (
    <div className="border-border-light relative rounded-lg border p-4">
      <input
        {...form.register(`bookableItems.${index}.key`)}
        type="hidden"
        value={item.key}
      />
      <Controller
        name={`bookableItems.${index}.value`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="col-span-full" data-invalid={fieldState.invalid}>
            <FieldLabel>{optionData.value}</FieldLabel>
            {optionData.comment ? (
              <Comment>{optionData.comment}</Comment>
            ) : null}
            <Input type={optionData.inputType} min={1} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="mt-2 grid grid-cols-2 gap-x-4">
        <Controller
          name={`bookableItems.${index}.startDate`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Hämta</FieldLabel>
              <DateTimePicker
                {...field}
                locale={sv}
                weekStartsOn={1}
                granularity="minute"
                hourCycle={24}
                yearRange={0}
                placeholder="Startdatum"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`bookableItems.${index}.endDate`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Hämta</FieldLabel>
              <DateTimePicker
                {...field}
                locale={sv}
                weekStartsOn={1}
                granularity="minute"
                hourCycle={24}
                yearRange={0}
                placeholder="Startdatum"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Comment className="col-span-full">
          Inventarier måste ofta bokas under en längre period än
          områdena/lokalerna till bokningen.
        </Comment>
      </div>
      <Button
        className="text-primary/60 hover:text-primary absolute top-1 right-1 h-7 w-7 rounded-full"
        size={"icon"}
        variant="ghost"
        onClick={handleDelete}
      >
        <TrashIcon className="h-5" />
      </Button>
    </div>
  );
};
