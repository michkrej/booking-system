import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type BookableItem } from "@/utils/interfaces";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const BOOKABLE_ITEM_OPTIONS: {
  key:
    | "bardiskar"
    | "bankset-hg"
    | "bankset-hoben"
    | "bankset-k"
    | "ff"
    | "forte"
    | "grillar"
    | "other"
    | "scenes"
    | "other-inventory";
  value: string;
  comment?: string;
  inputType: "text" | "number";
}[] = [
  {
    key: "bardiskar",
    value: "Bardiskar (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-hg",
    value: "Bänkset (HG)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-hoben",
    value: "Bänkset (Hoben)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-k",
    value: "Bänkset (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "ff",
    value: "FF inventarier",
    comment: "T.ex. topptält, popup tält, elverk, släp etc.",
    inputType: "text",
  },
  {
    key: "forte",
    value: "Forte",
    comment: "T.ex. sittningspaket, två högtalare och en mikrofon etc.",
    inputType: "text",
  },
  {
    key: "grillar",
    value: "Grillar (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "other-inventory",
    value: "Övriga inventarier",
    comment: "Övriga inventarier för bokningen",
    inputType: "text",
  },
];

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
