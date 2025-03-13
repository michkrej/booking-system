import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TrashIcon } from "lucide-react";
import { Comment } from "@/components/ui/comment";
import { type BookableItem } from "@/utils/interfaces";
import { BOOKABLE_ITEM_OPTIONS } from "./AddBookableItemDropdown";
import { sv } from "date-fns/locale";
import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type BookingSchema } from "./schema";

type InventoryItemProps = {
  item: BookableItem & { id: string };
  index: number;
  handleDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<z.infer<typeof BookingSchema>, any, undefined>;
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
              <Input id="newPlanName" type={optionData.inputType} {...field} />
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
        className="absolute right-1 top-1 h-7 w-7 rounded-full text-primary/60 hover:text-primary"
        size={"icon"}
        variant="ghost"
        onClick={handleDelete}
      >
        <TrashIcon className="h-5" />
      </Button>
    </div>
  );
};
