import { differenceInDays, format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  BuildingIcon,
  CalendarIcon,
  ChevronRight,
  MapPinIcon,
  NotebookPenIcon,
  UserIcon,
} from "lucide-react";
import { useContext } from "react";
import { committees } from "@data/committees";
import { Label } from "@/components/ui/label";
import { type Booking } from "@/interfaces/interfaces";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";
import { ScheduleContext } from "./ScheduleContext";

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

  const bookableItems = props.bookableItems ?? [];
  return (
    <div className="mt-3 flex flex-col gap-y-1 text-base">
      <div className="grid grid-cols-[20px_auto] items-center">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {getFormattedDate(props.startDate, props.endDate)}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <UserIcon className="mr-2 h-4 w-4" />
        {committees[props.committeeId]?.name}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <BuildingIcon className="mr-2 h-4 w-4" />
        {buildingName}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <MapPinIcon className="mr-2 h-4 w-4" />
        {roomNames}
      </div>
      <div className="grid grid-cols-[20px_auto] text-sm">
        <NotebookPenIcon className="mr-2 h-4 w-4" />
        {props.description ?? ""}
      </div>

      {bookableItems.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold">Material</Label>
          {bookableItems.map((item) => {
            const itemData = BOOKABLE_ITEM_OPTIONS.find(
              (option) => option.key === item.key,
            );

            if (!itemData) return null;
            return (
              <div key={item.key} className="flex items-center">
                <ChevronRight className="mr-1 h-4 w-4" />
                {itemData.value}: {item.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
