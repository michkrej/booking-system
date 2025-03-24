import { Button } from "@/components/ui/button";
import { addDays, addMonths, format } from "date-fns";
import {
  BaggageClaimIcon,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  TrashIcon,
} from "lucide-react";
import { ScheduleContext } from "./ScheduleContext";
import { useContext, useMemo } from "react";
import { sv } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { campusLocationsMap } from "@/data/locationsData";
import { type Location } from "@/utils/interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { useStoreBookings } from "@/hooks/useStoreBookings";
import { convertToDate } from "@/lib/utils";

const viewAdjustments = {
  TimelineDay: (date: Date, step: number) => addDays(date, step),
  TimelineWeek: (date: Date, step: number) => addDays(date, step * 7),
  TimelineMonth: (date: Date, step: number) => addMonths(date, step),
};

export type View = "TimelineDay" | "TimelineWeek" | "TimelineMonth";

export const ScheduleToolbar = ({
  hideDropdowns = false,
}: {
  hideDropdowns?: boolean;
}) => {
  const {
    schedule,
    currentView,
    setCurrentView,
    setChosenCampus,
    chosenCampus,
    setBuilding,
    building,
    locations,
  } = useContext(ScheduleContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDate, updatedCurrentDate } = useCurrentDate();
  const { bookings } = useStoreBookings();

  const changeDate = (step: number) => {
    updatedCurrentDate(viewAdjustments[currentView](currentDate, step));
  };

  const goToPrevious = () => changeDate(-1);
  const goToNext = () => changeDate(1);

  const switchToView = (view: View) => {
    setCurrentView(view);
    schedule.current?.changeCurrentView(view);
  };

  const getWeekDateSpan = () => {
    const dates = schedule.current?.activeView?.renderDates;
    if (!Array.isArray(dates) || dates.length === 0) return "";

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    if (!startDate || !endDate) return "";

    return `${format(startDate, "d", { locale: sv })} - ${format(endDate, "d MMMM yyyy", { locale: sv })}`;
  };

  const handleCampusChange = (option: "US" | "Valla") => {
    setChosenCampus(option);
    setBuilding(undefined);
  };

  const handleLocationChange = (option: Location["name"]) => {
    const buildingObject = Object.values(campusLocationsMap[chosenCampus]).find(
      (location) => location.name === option,
    );
    setBuilding(buildingObject);
  };

  const firstBookingDate = useMemo(() => {
    const sortedBookings = bookings.sort(
      (a, b) =>
        convertToDate(a.startDate).getTime() -
        convertToDate(b.startDate).getTime(),
    );
    return sortedBookings[0]?.startDate;
  }, [bookings]);

  const goToFirstBooking = () => {
    if (!firstBookingDate) return;
    updatedCurrentDate(convertToDate(firstBookingDate));
  };

  const isAtFirstBooking = useMemo(() => {
    if (!firstBookingDate) return false;
    if (!currentDate) return false;

    return (
      convertToDate(firstBookingDate).getDate() ===
      convertToDate(currentDate).getDate()
    );
  }, [firstBookingDate, currentDate]);

  const handleInventoryButtonClick = () => {
    toast.info("I inventarie-vyn går det inte att redigera några bokningar");
    navigate(`/inventory/${id}`);
  };

  return (
    <div className="flex w-full items-center justify-between border border-b-0 border-gray-200 bg-[#fafafa] px-4 py-2">
      {!hideDropdowns ? (
        <div className="flex flex-1 gap-x-4">
          <Select value={chosenCampus} onValueChange={handleCampusChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Välj campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="Valla">Valla</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-x-2">
            <Select
              value={building?.name ?? ""}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Välj byggnad" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  onClick={() => setBuilding(undefined)}
                  className="flex gap-2 rounded-full px-2 text-primary"
                  disabled={!building}
                >
                  <TrashIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Återställ byggnad</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  onClick={handleInventoryButtonClick}
                  className="flex gap-2 rounded-full px-2 text-primary"
                >
                  <BaggageClaimIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Se bokade inventarier</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() => navigate(`/booking/${id}`)}
              className="flex gap-2 rounded-full px-2 text-primary"
            >
              <CalendarIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Se bokningar</TooltipContent>
        </Tooltip>
      )}
      <div className="flex gap-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              disabled={isAtFirstBooking}
              onClick={goToFirstBooking}
            >
              <ChevronsLeft className="cursor-pointer hover:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Gå till första bokningen</TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-x-2">
          <Button size="icon" variant="ghost" onClick={goToPrevious}>
            <ChevronLeft className="cursor-pointer hover:text-primary" />
          </Button>
          <span className="pointer-events-none w-[180px] text-center">
            {currentView === "TimelineDay"
              ? format(currentDate, "d MMMM yyyy", { locale: sv })
              : null}
            {currentView === "TimelineWeek" ? getWeekDateSpan() : null}
            {currentView === "TimelineMonth"
              ? format(currentDate, "MMMM yyyy", { locale: sv })
              : null}
          </span>
          <Button size="icon" variant="ghost" onClick={goToNext}>
            <ChevronRight className="cursor-pointer hover:text-primary" />
          </Button>
        </div>
        <Button
          size="sm"
          variant={currentView === "TimelineDay" ? "default" : "ghost"}
          onClick={() => switchToView("TimelineDay")}
        >
          Dag
        </Button>
        <Button
          size="sm"
          variant={currentView === "TimelineWeek" ? "default" : "ghost"}
          onClick={() => switchToView("TimelineWeek")}
        >
          Vecka
        </Button>
        <Button
          size="sm"
          variant={currentView === "TimelineMonth" ? "default" : "ghost"}
          onClick={() => switchToView("TimelineMonth")}
        >
          Månad
        </Button>
      </div>
    </div>
  );
};
