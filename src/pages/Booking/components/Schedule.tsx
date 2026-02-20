import {
  type ActionEventArgs,
  DragAndDrop,
  Inject,
  Resize,
  ResourceDirective,
  ResourcesDirective,
  ScheduleComponent,
  TimelineMonth,
  TimelineViews,
  ViewDirective,
  ViewsDirective,
} from "@syncfusion/ej2-react-schedule";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useBookingActions } from "@hooks/useBookingActions";
import { useBookingState } from "@hooks/useBookingState";
import { useCurrentDate } from "@hooks/useCurrentDate";
import { corridorsC } from "@data/campusValla/rooms";
import { committees } from "@data/committees";
import { campusLocationsMap } from "@data/locationsData";
import { type Booking, type NewBooking } from "@/interfaces/interfaces";
import { shiftBookableItemTimes } from "@/utils/bookingUtils";
import { viewCollisionsPath, viewPath } from "@/utils/constants";
import { EditBookingDialog } from "./EditBookingDialog";
import { NewBookingDialog } from "./NewBookingDialog";
import { QuickInfoContentTemplate } from "./QuickInfoContentTemplate";
import { ScheduleContext } from "./ScheduleContext";
import { ScheduleToolbar } from "./ScheduleToolbar";
import "./localization";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources
// https://ej2.syncfusion.com/react/documentation/schedule/editor-template

export const Schedule = () => {
  const {
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
    setAction,
    isCreateBookingModalOpen,
    setIsCreateBookingModalOpen,
    isUpdateBookingModalOpen,
    setIsUpdateBookingModalOpen,
    bookings,
    deletedBooking,
    updatedBooking,
    activePlans,
    user,
  } = useBookingState();
  const { updateBookingMutation, deleteBookingMutation } = useBookingActions();
  const { id = "" } = useParams();
  const { currentDate } = useCurrentDate();
  const { isPlanEditLocked } = useAdminSettings();

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
    if ((id === viewPath || id === viewCollisionsPath) && !e.data.id) {
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
      setIsUpdateBookingModalOpen(true);
      e.cancel = true;
      return;
    }
  };

  // Set the event color to the committee color
  const onEventRendered = (args: { element: HTMLElement; data: Booking }) => {
    const committee = committees[args.data.committeeId];
    if (!committee) return;

    args.element.style.backgroundColor = committee.color;
    args.element.style.color = committee?.textColor ?? "white";
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

      if (plan.userId !== user.id) {
        toast.error("Du kan inte uppdatera andra fadderiers bokningar");
        args.cancel = true;
        return;
      }

      // Find original booking to shift inventory times relative to event move
      const originalBooking = bookings.find((b) => b.id === updatedEvent.id);
      let finalBooking = updatedEvent;
      if (originalBooking?.bookableItems?.length) {
        const shiftedItems = shiftBookableItemTimes(
          originalBooking.startDate,
          updatedEvent.startDate,
          originalBooking.bookableItems
        );
        finalBooking = { ...updatedEvent, bookableItems: shiftedItems };
      }

      updateBookingMutation.mutate(
        { booking: finalBooking, plan },
        {
          onSuccess: () => {
            updatedBooking(finalBooking);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!isPlanEditLocked) return;

    toast.warning("Redigering av bokningar är låst", {
      id: "plan-edit-locked",
      position: "bottom-left",
      duration: Infinity,
      action: {
        label: "OK",
        onClick: () => toast.dismiss("plan-edit-locked"),
      },
    });
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        schedule: scheduleObj,
        currentView,
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
          readonly={isPlanEditLocked}
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
          endHour="24:00"
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

      <NewBookingDialog
        data={newBooking}
        open={isCreateBookingModalOpen}
        onOpenChange={() => setIsCreateBookingModalOpen((prev) => !prev)}
      />

      <EditBookingDialog
        data={editBooking}
        open={isUpdateBookingModalOpen}
        onOpenChange={() => setIsUpdateBookingModalOpen((prev) => !prev)}
      />
    </ScheduleContext.Provider>
  );
};
