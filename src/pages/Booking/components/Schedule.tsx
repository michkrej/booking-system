import { createContext, useMemo, useRef } from "react";
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
import {
  type Booking,
  type Room,
  type Location,
  type NewBooking,
  Plan,
} from "@/utils/interfaces";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { campusLocationsMap } from "@/data/locationsData";
import { toast } from "sonner";
import { EditorTemplate } from "./editorTemplate";
import { committees } from "@/data/committees";
import { ScheduleToolbar, type View } from "./ScheduleToolbar";
import { plansService } from "@/services";
import { useBookingState } from "@/hooks/useBookingState";

import "./localization";
import { useBookingActions } from "@/hooks/useBookingActions";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources
// https://ej2.syncfusion.com/react/documentation/schedule/editor-template

type ScheduleContextType = {
  schedule: React.RefObject<ScheduleComponent>;
  currentDate: Date;
  currentView: View;
  chosenCampus: "US" | "Valla";
  building: Location | undefined;
  currentPlan: Plan | null;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: View) => void;
  setChosenCampus: (campus: "US" | "Valla") => void;
  setBuilding: (building: Location | undefined) => void;
  locations: Location[];
  rooms: Room[];
};
export const ScheduleContext = createContext<ScheduleContextType>(
  {} as ScheduleContextType,
);

export const Schedule = () => {
  const {
    currentDate,
    setCurrentDate,
    currentView,
    setCurrentView,
    chosenCampus,
    setChosenCampus,
    building,
    setBuilding,
    editBooking,
    setEditBooking,
    newBooking,
    setNewBooking,
    action,
    setAction,
    isCreateBookingModalOpen,
    setIsCreateBookingModalOpen,
    bookings,
    deletedBooking,
    updatedBooking,
    currentPlan,
    user,
  } = useBookingState();
  const { updateBookingMutation, deleteBookingMutation } = useBookingActions();

  const scheduleObj = useRef<ScheduleComponent>(null);

  // Locations in the campus
  const locations = useMemo(
    () =>
      Object.values(campusLocationsMap[chosenCampus]).sort((a, b) =>
        a.name.localeCompare(b.name, "sv"),
      ),
    [chosenCampus],
  );

  // Rooms in the building
  const rooms = useMemo(() => {
    const campus = campusLocationsMap[chosenCampus];

    if (!building)
      return Object.values(campus).flatMap((location) => location.rooms);

    const _building = Object.values(campus).find(
      (location) => location.name === building.name,
    );

    return _building
      ? _building.rooms.sort((a, b) =>
          a.name.localeCompare(b.name, "sv", { numeric: true }),
        )
      : [];
  }, [building, chosenCampus]);

  // Handle popup open events
  const onPopupOpen = (e: {
    type: "QuickInfo" | "Editor";
    data: Booking;
    cancel: boolean;
  }) => {
    console.log(e);
    if (!building && !e.data?.id) {
      toast.error("Du måste välja en byggnad för att skapa en bokning");
      e.cancel = true;
      return;
    }

    if (e.type === "QuickInfo" && !e.data?.id && building) {
      console.log("Create/edit booking");
      setNewBooking(e.data as unknown as NewBooking);
      setAction("create");
      setIsCreateBookingModalOpen(true);
      e.cancel = true;
      return;
    }

    if (e.type === "Editor" && e.data?.id) {
      console.log("Edit booking");
      setEditBooking(e.data);
      setAction("edit");
      setIsCreateBookingModalOpen(true);
      e.cancel = true;
      return;
    }
  };

  // Set the event color to the committee color
  const onEventRendered = (args: { element: HTMLElement }) => {
    args.element.style.backgroundColor = committees[user.committeeId].color;
  };

  // Handle delete and drag and drop events
  const onActionBegin = (args: ActionEventArgs): void => {
    if (args.requestType === "eventRemove" && args.deletedRecords?.length) {
      const entry = args.deletedRecords[0] as Booking;
      deleteBookingMutation.mutate(
        { booking: entry, plan: currentPlan },
        {
          onSuccess: () => {
            deletedBooking(entry.id);
          },
        },
      );
      return;
    }

    if (args.requestType === "eventChange" && args.changedRecords) {
      const updatedEvent = args.changedRecords[0] as Booking;

      updateBookingMutation.mutate(
        { booking: updatedEvent, plan: currentPlan },
        {
          onSuccess: () => {
            updatedBooking(updatedEvent);
          },
        },
      );
    }
  };

  return (
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
        currentPlan,
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
      {isCreateBookingModalOpen && action === "create" ? (
        <EditorTemplate
          action="create"
          data={newBooking}
          open={isCreateBookingModalOpen}
          onOpenChange={() => setIsCreateBookingModalOpen((prev) => !prev)}
        />
      ) : (
        <EditorTemplate
          action="edit"
          data={editBooking}
          open={isCreateBookingModalOpen}
          onOpenChange={() => setIsCreateBookingModalOpen((prev) => !prev)}
        />
      )}
    </ScheduleContext.Provider>
  );
};
