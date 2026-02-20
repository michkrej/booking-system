import { sv } from "date-fns/locale";
import { TrashIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "@ui/button";
import { Comment } from "@ui/comment";
import { DateTimePicker } from "@ui/date-time-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
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
      <FormField
        name={`bookableItems.${index}.value`}
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-full space-y-0">
            <FormLabel>{optionData.value}</FormLabel>
            {optionData.comment ? (
              <Comment>{optionData.comment}</Comment>
            ) : null}
            <FormControl>
              <Input type={optionData.inputType} min={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-2 grid grid-cols-2 gap-x-4">
        <FormField
          name={`bookableItems.${index}.startDate`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Hämta</FormLabel>
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
          name={`bookableItems.${index}.endDate`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Hämta</FormLabel>
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
