import { Layout } from "@/components/molecules/layout";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  ScheduleComponent,
  Inject,
  ViewsDirective,
  ViewDirective,
  TimelineViews,
  ResourcesDirective,
  ResourceDirective,
  Resize,
  DragAndDrop,
  TimelineMonth,
} from "@syncfusion/ej2-react-schedule";
import { Booking, Room, type Location } from "@/utils/interfaces";
import { ChevronLeft, ChevronRight, TrashIcon } from "lucide-react";
import { addDays, addMonths, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sv } from "date-fns/locale";
import { useBookings, useUser } from "@/state";
import { defaultCampus } from "@/utils/helpers";
import { campusLocationsMap } from "@/data/locationsData";
import { toast } from "sonner";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { EditorTemplate } from "./components/editorTemplate";

import "./components/localization";
import { committees } from "@/data/committees";

type View = "TimelineDay" | "TimelineWeek" | "TimelineMonth";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources
// https://ej2.syncfusion.com/react/documentation/schedule/editor-template

type ScheduleContextType = {
  schedule: React.RefObject<ScheduleComponent>;
  currentDate: Date;
  currentView: View;
  chosenCampus: "US" | "Valla";
  building: string | undefined;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: View) => void;
  setChosenCampus: (campus: "US" | "Valla") => void;
  setBuilding: (building: string | undefined) => void;
  locations: Location[];
  rooms: Room[];
};
export const ScheduleContext = createContext<ScheduleContextType>(
  {} as ScheduleContextType,
);

export const BookingPage = () => {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("TimelineDay");
  const [chosenCampus, setChosenCampus] = useState(
    defaultCampus(user.committeeId).label,
  );
  const [building, setBuilding] = useState<string | undefined>();
  const [newBooking, setNewBooking] = useState<any>({});
  const { bookings } = useBookings();
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] =
    useState(false);

  const scheduleObj = useRef<ScheduleComponent>(null);

  // Locations in the campus
  const locations = useMemo(() => {
    const res = Object.values(campusLocationsMap[chosenCampus]);

    return res
      .map((location) => ({
        ...location,
        expanded: false,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [chosenCampus]);

  // Rooms in the building
  const rooms = useMemo(() => {
    if (!building) return [];

    const campus = campusLocationsMap[chosenCampus];

    const _building = Object.values(campus).find(
      (location) => location.name === building,
    );

    if (!_building) return [];

    return _building.rooms.sort((a, b) =>
      a.name.localeCompare(b.name, "sv", { numeric: true }),
    );
  }, [building, chosenCampus]);

  return (
    <Layout className="!p-0">
      <ScheduleContext.Provider
        value={{
          schedule: scheduleObj,
          currentDate,
          currentView,
          setCurrentDate,
          setCurrentView,
          setChosenCampus,
          chosenCampus,
          setBuilding,
          building,
          locations,
          rooms,
        }}
      >
        <div className="h-[calc(100vh-121px)]">
          <ScheduleToolbar />
          <ScheduleComponent
            locale="sv"
            ref={scheduleObj}
            width="100%"
            height="100%"
            // editorTemplate={EditorTemplate}
            popupClose={(args) => {
              // console.log(args);
            }}
            showQuickInfo={false}
            workHours={{ highlight: false }}
            timeScale={{
              enable: true,
              interval: 60,
              slotCount: 1,
            }}
            showTimeIndicator={false}
            selectedDate={currentDate}
            startHour="06:00"
            endHour="23:00"
            firstDayOfWeek={1}
            currentView={currentView}
            eventSettings={{
              dataSource: bookings,
              fields: {
                id: "id",
                subject: {
                  name: "title",
                },
                description: { title: "Comments", name: "description" },
                startTime: { title: "From", name: "startDate" },
                endTime: { title: "To", name: "endDate" },
              },
            }}
            timezone="Europe/Stockholm"
            group={{
              enableCompactView: false,
              resources: ["Locations", "Rooms"],
            }}
            showHeaderBar={false}
            popupOpen={(e) => {
              if (!building) {
                toast.error(
                  "Du måste välja en byggnad för att skapa ett bokning",
                );
                e.cancel = true;
                return;
              }
              setNewBooking(e.data);
              setIsCreateBookingModalOpen(true);
              e.cancel = true;
            }}
            rowAutoHeight={true}
            eventRendered={(args) => {
              const commitee = committees[user.committeeId];
              args.element.style.backgroundColor = commitee.color;
            }}
          >
            <ResourcesDirective>
              {building ? (
                <ResourceDirective
                  field="roomId"
                  title="Rooms"
                  name="Rooms"
                  allowMultiple={true}
                  dataSource={rooms}
                  textField="name"
                  idField="id"
                  colorField="color"
                  groupIDField="groupId"
                />
              ) : (
                <ResourceDirective
                  field="locationId"
                  title="Location"
                  name="Locations"
                  allowMultiple={false}
                  dataSource={locations}
                  textField="name"
                  idField="id"
                  colorField="color"
                  // expandedField="expanded"
                />
              )}
            </ResourcesDirective>
            <ViewsDirective>
              <ViewDirective
                option="TimelineDay"
                eventTemplate={(props: Booking) => {
                  console.log(props);
                  return (
                    <div className="relative">
                      <div className="e-subject">{props.title}</div>
                      <div className="text-[10px]">
                        {format(props.startDate, "HH:mm", { locale: sv })}
                        {" - "}
                        {format(props.endDate, "HH:mm", { locale: sv })}
                      </div>
                      <div className="absolute bottom-[-2px] right-[-2.7em]">
                        {committees[user.committeeId].name}
                      </div>
                    </div>
                  );
                }}
              />
              <ViewDirective option="TimelineWeek" />
              <ViewDirective option="TimelineMonth" />
            </ViewsDirective>
            <Inject
              services={[TimelineViews, TimelineMonth, Resize, DragAndDrop]}
            />
          </ScheduleComponent>
        </div>
        <EditorTemplate
          currentBuilding={building ?? ""}
          data={newBooking}
          open={isCreateBookingModalOpen}
          onOpenChange={() => setIsCreateBookingModalOpen((prev) => !prev)}
        />
      </ScheduleContext.Provider>
    </Layout>
  );
};

const viewAdjustments = {
  TimelineDay: (date: Date, step: number) => addDays(date, step),
  TimelineWeek: (date: Date, step: number) => addDays(date, step * 7),
  TimelineMonth: (date: Date, step: number) => addMonths(date, step),
};

const ScheduleToolbar = () => {
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
    setBuilding("");
  };

  return (
    <div className="flex w-full items-center justify-between border border-b-0 border-gray-200 bg-[#fafafa] px-4 py-2">
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
          <Select value={building ?? ""} onValueChange={setBuilding}>
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
      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-2">
          <Button size="icon" variant="ghost" onClick={goToPrevious}>
            <ChevronLeft className="cursor-pointer hover:text-primary" />
          </Button>
          <span className="pointer-events-none">
            {currentView === "TimelineDay"
              ? currentDate.toLocaleDateString()
              : null}
            {currentView === "TimelineWeek" ? getWeekDateSpan() : null}
            {currentView === "TimelineMonth"
              ? format(currentDate, "MMMM", { locale: sv })
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
