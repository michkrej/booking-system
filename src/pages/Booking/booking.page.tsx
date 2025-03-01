import { Layout } from "@/components/molecules/layout";
import { createContext, useMemo, useRef, useState } from "react";
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
  type ActionEventArgs,
} from "@syncfusion/ej2-react-schedule";
import { type Booking, type Room, type Location } from "@/utils/interfaces";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useBookings, useUser } from "@/state";
import { defaultCampus } from "@/utils/helpers";
import { campusLocationsMap } from "@/data/locationsData";
import { toast } from "sonner";
import { EditorTemplate } from "./components/editorTemplate";
import { committees } from "@/data/committees";
import { ScheduleToolbar, type View } from "./components/ScheduleToolbar";

import "./components/localization";
import { useStoreUser } from "@/hooks/useStoreUser";
import { useStoreBookings } from "@/hooks/useStoreBookings";

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
  const { user } = useStoreUser();
  const { bookings } = useStoreBookings();

  const [currentDate, setCurrentDate] = useState(new Date("2026-01-01"));
  const [currentView, setCurrentView] = useState<View>("TimelineDay");
  const [chosenCampus, setChosenCampus] = useState(
    defaultCampus(user.committeeId).label,
  );
  const [building, setBuilding] = useState<string | undefined>();
  const [newBooking, setNewBooking] = useState<Booking | undefined>();
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
    const campus = campusLocationsMap[chosenCampus];

    if (!building)
      return Object.values(campus).flatMap((location) => location.rooms);

    const _building = Object.values(campus).find(
      (location) => location.name === building,
    );

    if (!_building) {
      console.error("Building not found");
      return [];
    }

    return _building.rooms.sort((a, b) =>
      a.name.localeCompare(b.name, "sv", { numeric: true }),
    );
  }, [building, chosenCampus]);

  const onPopupOpen = (e: { type: string; data: Booking; cancel: boolean }) => {
    console.log(e);

    const isQuickInfo = e.type === "QuickInfo";
    const isEditor = e.type === "Editor";
    const clickedExistingBooking = e.data.id;
    const clickedCell = !e.data?.id;

    if (!building && clickedCell) {
      console.log("Need to select a building");
      toast.error("Du måste välja en byggnad för att skapa en bokning");
      e.cancel = true;
      return;
    }

    if (
      (isQuickInfo && clickedCell && building) ||
      (isEditor && clickedExistingBooking)
    ) {
      console.log("Create/edit booking");
      setNewBooking(e.data);
      setIsCreateBookingModalOpen(true);
      e.cancel = true;
      return;
    }
  };

  // Set the event color to the committee color
  const onEventRendered = (args: { element: HTMLElement }) => {
    const commitee = committees[user.committeeId];
    args.element.style.backgroundColor = commitee.color;
  };

  const onActionBegin = (args: ActionEventArgs): void => {
    console.log(args);
    if (
      args.requestType === "eventCreate" ||
      args.requestType === "eventChange"
    ) {
      const data: Record<string, any> =
        args.data instanceof Array ? args.data[0] : args.data;
      args.cancel = !scheduleObj.current?.isSlotAvailable(data);
    }
  };

  return (
    <Layout className="bg-white !p-0" hideFooter>
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
            showQuickInfo={true}
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
            showWeekNumber={false}
            showHeaderBar={false}
            rowAutoHeight={true}
            popupOpen={onPopupOpen}
            eventRendered={onEventRendered}
            actionBegin={onActionBegin}
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
