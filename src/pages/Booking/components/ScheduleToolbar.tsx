import { Button } from "@/components/ui/button";
import { addDays, addMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, TrashIcon } from "lucide-react";
import { ScheduleContext } from "./Schedule";
import { useContext } from "react";
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
    currentDate,
    currentView,
    setCurrentDate,
    setCurrentView,
    setChosenCampus,
    chosenCampus,
    setBuilding,
    building,
    locations,
  } = useContext(ScheduleContext);

  const changeDate = (step: number) => {
    setCurrentDate(viewAdjustments[currentView](currentDate, step));
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

  return (
    <div className="flex w-full items-center justify-between border border-b-0 border-gray-200 bg-[#fafafa] px-4 py-2">
      {!hideDropdowns ? (
        <div className="flex flex-1 gap-x-4">
          <Select value={chosenCampus} onValueChange={handleCampusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Välj campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="Valla">Valla</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Select
              value={building?.name ?? ""}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-[200px]">
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
            {building && (
              <Button
                variant={"ghost"}
                onClick={() => setBuilding(undefined)}
                className="flex gap-2 px-1 text-primary"
              >
                <TrashIcon />
                Återställ byggnad
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div />
      )}
      <div className="flex gap-x-2">
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
