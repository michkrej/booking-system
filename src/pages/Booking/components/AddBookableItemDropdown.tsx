import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { BOOKABLE_ITEM_OPTIONS } from "@utils/CONSTANTS";
import { type BookableItem } from "@utils/interfaces";

import { Button } from "@ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export const AddBookableItemDropdown = ({
  addBookableItemToBooking,
  bookableItems,
}: {
  addBookableItemToBooking: (itemName: string) => void;
  bookableItems: BookableItem[];
}) => {
  const [itemName, setItemName] = useState("");

  const options = useMemo(() => {
    return BOOKABLE_ITEM_OPTIONS.filter(
      (option) => !bookableItems.find((item) => item.key === option.key),
    );
  }, [bookableItems]);

  return (
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
  );
};
