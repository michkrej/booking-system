import { committees } from "@/data/committees";
import { DEFAULT_ITEMS } from "@/state/adminStoreSlice";
import { itemTranslations } from "@/utils/CONSTANTS";
import { type BookableItemName, type Booking } from "@/utils/interfaces";
import { Label } from "@radix-ui/react-label";
import {
  BuildingIcon,
  CalendarIcon,
  ChevronRight,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { useContext } from "react";
import { ScheduleContext } from "./Schedule";
import { differenceInDays, format } from "date-fns";
import { sv } from "date-fns/locale";

const getFormattedDate = (startDate: Date, endDate: Date) => {
  const eventSpansSeveralDays = differenceInDays(endDate, startDate);

  if (eventSpansSeveralDays > 0) {
    return `${format(startDate, "dd MMMM yyyy (HH:mm)", { locale: sv })} - ${format(endDate, "dd MMMM yyyy (HH:mm)", { locale: sv })}`;
  }

  return `${format(startDate, "d MMMM yyyy", { locale: sv })} (${format(startDate, "HH:mm", { locale: sv })} - ${format(endDate, "HH:mm", { locale: sv })})`;
};

export const QuickInfoContentTemplate = (
  props: Booking & { elementType: string },
) => {
  const { rooms, locations } = useContext(ScheduleContext);
  if (props.elementType !== "event") return null;

  const buildingName = locations.find(
    (location) => location.id === props.locationId,
  )?.name;
  const roomNames = props.roomId
    .map((roomId) => rooms.find((room) => room.id === roomId)?.name)
    .join(", ");

  const items = Object.keys(DEFAULT_ITEMS).reduce(
    (items, item) => {
      const typedItem = item as BookableItemName;
      if (props[typedItem]) {
        items[typedItem] = props[typedItem];
      }
      return items;
    },
    {} as Record<BookableItemName, number>,
  );

  return (
    <div className="mt-3 flex flex-col gap-y-1 text-base">
      <div className="grid grid-cols-[20px_auto] items-center">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {getFormattedDate(props.startDate, props.endDate)}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <UserIcon className="mr-2 h-4 w-4" />
        {committees[props.committeeId].name}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <BuildingIcon className="mr-2 h-4 w-4" />
        {buildingName}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <MapPinIcon className="mr-2 h-4 w-4" />
        {roomNames}
      </div>
      {Object.keys(items).length > 0 && (
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold">Material</Label>
          {Object.entries(items).map(([item, value]) => (
            <div key={item} className="flex items-center">
              <ChevronRight className="mr-1 h-4 w-4" />
              {itemTranslations[item as BookableItemName]}: {value} st
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
