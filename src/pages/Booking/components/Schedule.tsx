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
  type Plan,
  BookableItemName,
} from "@/utils/interfaces";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { campusLocationsMap } from "@/data/locationsData";
import { toast } from "sonner";
import { EditorTemplate } from "./editorTemplate";
import { committees } from "@/data/committees";
import { ScheduleToolbar, type View } from "./ScheduleToolbar";
import { useBookingState } from "@/hooks/useBookingState";

import "./localization";
import { useBookingActions } from "@/hooks/useBookingActions";
import { useParams } from "react-router-dom";
import { corridorsC } from "@/data/campusValla/rooms";
import {
  BuildingIcon,
  ChevronRight,
  DotIcon,
  MapPinIcon,
  PinIcon,
  UserIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { DEFAULT_ITEMS } from "@/state/adminStoreSlice";
import { QuickInfoContentTemplate } from "./QuickInfoContentTemplate";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources
// https://ej2.syncfusion.com/react/documentation/schedule/editor-template

type ScheduleContextType = {
  schedule: React.RefObject<ScheduleComponent>;
  currentDate: Date;
  currentView: View;
  chosenCampus: "US" | "Valla";
  building: Location | undefined;
  activePlans: Plan[];
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
    activePlans,
    user,
  } = useBookingState();
  const { updateBookingMutation, deleteBookingMutation } = useBookingActions();
  const { id = "" } = useParams();

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

  const scheduleDisplayRooms = useMemo(() => {
    if (building?.name === "C-huset") {
      const corridorIds: string[] = Object.values(corridorsC).map(
        (corridor) => corridor.id,
      );
      return building?.rooms.filter((room) => !corridorIds.includes(room.id));
    }

    return building?.rooms ?? [];
  }, [building]);

  // Handle popup open events
  const onPopupOpen = (e: {
    type: "QuickInfo" | "Editor";
    data: Booking;
    cancel: boolean;
  }) => {
    if (id === "view" && !e.data.id) {
      toast.error("Det går inte att skapa nya bokningar i denna vy");
      e.cancel = true;
      return;
    }

    if (!building && !e.data?.id) {
      toast.error("Du måste välja en byggnad för att skapa en bokning");
      e.cancel = true;
      return;
    }

    if (e.type === "QuickInfo" && !e.data?.id && building) {
      setNewBooking(e.data as unknown as NewBooking);
      setAction("create");
      setIsCreateBookingModalOpen(true);
      e.cancel = true;
      return;
    }

    if (e.type === "Editor" && e.data?.id) {
      setEditBooking(e.data);
      setAction("edit");
      setIsCreateBookingModalOpen(true);
      e.cancel = true;
      return;
    }
  };

  // Set the event color to the committee color
  const onEventRendered = (args: { element: HTMLElement; data: Booking }) => {
    args.element.style.backgroundColor =
      committees[args.data.committeeId].color;
  };

  // Handle delete and drag and drop events
  const onActionBegin = (args: ActionEventArgs): void => {
    if (args.requestType === "eventRemove" && args.deletedRecords?.length) {
      const entry = args.deletedRecords[0] as Booking;

      const plan = activePlans.find((plan) => plan.id === entry.planId);
      if (!plan) {
        console.warn("Plan not found");
        args.cancel = true;
        return;
      }

      if (plan.userId !== user.id /* && !user.admin */) {
        toast.error("Du kan inte radera andra fadderiers bokningar");
        args.cancel = true;
        return;
      }

      deleteBookingMutation.mutate(
        { booking: entry, plan: plan },
        {
          onSuccess: () => {
            deletedBooking(entry);
          },
        },
      );
      return;
    }

    if (args.requestType === "eventChange" && args.changedRecords) {
      const updatedEvent = args.changedRecords[0] as Booking;

      // convert roomId to array if it's a string
      if (typeof updatedEvent.roomId === "string") {
        updatedEvent.roomId = [updatedEvent.roomId];
      }

      const plan = activePlans.find((plan) => plan.id === updatedEvent.planId);
      if (!plan) {
        console.warn("Plan not found");
        args.cancel = true;
        return;
      }

      if (plan.userId !== user.id /* && !user.admin */) {
        toast.error("Du kan inte uppdatera andra fadderiers bokningar");
        args.cancel = true;
        return;
      }

      updateBookingMutation.mutate(
        { booking: updatedEvent, plan },
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
        activePlans,
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
          quickInfoTemplates={{
            content: QuickInfoContentTemplate,
          }}
          dragStart={(e: { cancel: boolean }) => {
            if (!building) {
              e.cancel = true;
              toast.error(
                "Du måste välja en byggnad för att drag and drop av bokningar ska fungera",
              );
            }
            return e;
          }}
        >
          <ResourcesDirective>
            {building ? (
              <ResourceDirective
                field="roomId"
                title="Rooms"
                name="Rooms"
                allowMultiple={true}
                dataSource={scheduleDisplayRooms}
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
            <ViewDirective option="TimelineDay" />
            <ViewDirective option="TimelineWeek" allowVirtualScrolling={true} />
            <ViewDirective
              option="TimelineMonth"
              allowVirtualScrolling={true}
            />
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
