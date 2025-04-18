import { committees } from "@/data/committees";
import { type Booking } from "@utils/interfaces";
import {
  BuildingIcon,
  CalendarClockIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { sv } from "date-fns/locale";
import { locationsNonGrouped, rooms } from "@/data/locationsData";

const getFormattedDate = (startDate: Date, endDate: Date) => {
  const eventSpansSeveralDays = differenceInDays(endDate, startDate);

  if (eventSpansSeveralDays > 0) {
    return `${format(startDate, "dd MMMM yyyy (HH:mm)", { locale: sv })} - ${format(endDate, "dd MMMM yyyy (HH:mm)", { locale: sv })}`;
  }

  return `${format(startDate, "d MMMM yyyy", { locale: sv })} (${format(startDate, "HH:mm", { locale: sv })} - ${format(endDate, "HH:mm", { locale: sv })})`;
};

export const QuickInfoContentInventoryTemplate = (
  props: Booking & { bookingTitle: string } & { elementType: string },
) => {
  if (props.elementType !== "event") return null;

  const buildingName = locationsNonGrouped.find(
    (location) => location.id === props.locationId,
  )?.name;
  const roomNames = props.roomId
    .map((roomId) => rooms.find((room) => room.id === roomId)?.name)
    .join(", ");

  return (
    <div className="mt-3 flex flex-col gap-y-1 text-base">
      <div className="grid grid-cols-[20px_auto] items-center">
        <CalendarIcon className="mr-2 h-4 w-4" />
        Event: {props.bookingTitle}
      </div>
      <div className="grid grid-cols-[20px_auto] items-center">
        <CalendarClockIcon className="mr-2 h-4 w-4" />
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
    </div>
  );
};
