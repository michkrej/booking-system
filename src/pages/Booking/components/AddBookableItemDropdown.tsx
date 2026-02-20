import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";
import type { BookingSchemaInput } from "./schema";

export const AddBookableItemDropdown = ({
  addBookableItemToBooking,
  bookableItems,
}: {
  addBookableItemToBooking: (itemName: string) => void;
  bookableItems: BookingSchemaInput["bookableItems"];
}) => {
  const [itemName, setItemName] = useState("");

  const options = useMemo(() => {
    return BOOKABLE_ITEM_OPTIONS.filter(
      (option) => !bookableItems?.find((item) => item.key === option.key),
    );
  }, [bookableItems]);

  return (
    <Field>
      <Label>Inventarier</Label>
      <div className="flex gap-x-3">
        <Select value={itemName} onValueChange={setItemName}>
          <SelectTrigger>
            <SelectValue placeholder="Lägg till inventarie" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="icon"
          className="flex aspect-square w-10 items-center justify-center rounded-full"
          type="button"
          onClick={() => {
            addBookableItemToBooking(itemName);
            setItemName("");
          }}
          disabled={!itemName}
        >
          <PlusIcon />
        </Button>
      </div>
    </Field>
  );
};
