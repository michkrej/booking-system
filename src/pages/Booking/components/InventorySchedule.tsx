import {
  Inject,
  ResourceDirective,
  ResourcesDirective,
  ScheduleComponent,
  TimelineMonth,
  TimelineViews,
  ViewDirective,
  ViewsDirective,
  type PopupOpenEventArgs,
} from "@syncfusion/ej2-react-schedule";
import { useMemo, useRef } from "react";

import { committees } from "@/data/committees";
import { useBookingState } from "@/hooks/useBookingState";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { convertToDate } from "@/lib/utils";
import { type Booking } from "@/utils/interfaces";
import { QuickInfoContentInventoryTemplate } from "./QuickInfoContentInventoryTemplate";
import { ScheduleContext } from "./Schedule";
import { ScheduleToolbar } from "./ScheduleToolbar";

import "./localization";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/CONSTANTS";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources
// https://ej2.syncfusion.com/react/documentation/schedule/editor-template

export const InventorySchedule = () => {
  const {
    currentView,
    setCurrentView,
    chosenCampus,
    setChosenCampus,
    building,
    setBuilding,
    bookings,
    activePlans,
  } = useBookingState();
  const { currentDate } = useCurrentDate();

  const scheduleObj = useRef<ScheduleComponent>(null);

  const itemBookings = useMemo(() => {
    return bookings.flatMap((booking) =>
      (booking?.bookableItems ?? []).map((bookableItem) => ({
        ...booking,
        id: `${booking.id}-${bookableItem.key}`,
        title: `${bookableItem.value} - ${booking.title}`,
        bookingTitle: booking.title,
        ...bookableItem,
        startDate: convertToDate(bookableItem.startDate),
        endDate: convertToDate(bookableItem.endDate),
        color: committees[booking.committeeId].color,
        item: bookableItem.key,
      })),
    );
  }, [bookings]);

  const onEventRendered = (args: {
    element: HTMLElement;
    data: (typeof itemBookings)[number];
  }) => {
    args.element.style.backgroundColor = args.data.color;
  };

  const QuickInfoHeader = (
    args: Booking & { color: string; bookingTitle: string },
  ) => {
    return (
      <div
        style={{ backgroundColor: args.color }}
        className="p-4 text-lg text-white"
      >
        {args.title}
      </div>
    );
  };

  const onPopupOpen = (args: PopupOpenEventArgs): void => {
    if (args.type === "Editor") {
      args.cancel = true;
      return;
    }

    if (args.type === "QuickInfo" && !args?.data?.id) {
      args.cancel = true;
      return;
    }
  };

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
        locations: [],
        rooms: [],
        activePlans,
      }}
    >
      <div className="h-[calc(100vh-121px)]">
        <ScheduleToolbar hideDropdowns />
        <ScheduleComponent
          locale="sv"
          ref={scheduleObj}
          width="100%"
          height="100%"
          showQuickInfo={true}
          showHeaderBar={false}
          showWeekNumber={false}
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
            dataSource: itemBookings,
            fields: {
              id: "id",
              subject: {
                name: "title",
              },
              startTime: { title: "From", name: "startDate" },
              endTime: { title: "To", name: "endDate" },
            },
          }}
          timezone="Europe/Stockholm"
          group={{
            enableCompactView: false,
            resources: ["bookableItems"],
          }}
          rowAutoHeight={true}
          eventRendered={onEventRendered}
          popupOpen={onPopupOpen}
          quickInfoTemplates={{
            header: QuickInfoHeader,
            content: QuickInfoContentInventoryTemplate,
          }}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="key"
              title="Inventarie"
              name="bookableItems"
              allowMultiple={true}
              dataSource={BOOKABLE_ITEM_OPTIONS}
              textField="value"
              idField="key"
            />
          </ResourcesDirective>
          <ViewsDirective>
            <ViewDirective option="TimelineDay" />
            <ViewDirective option="TimelineWeek" allowVirtualScrolling={true} />
            <ViewDirective
              option="TimelineMonth"
              allowVirtualScrolling={true}
            />
          </ViewsDirective>
          <Inject services={[TimelineViews, TimelineMonth]} />
        </ScheduleComponent>
      </div>
    </ScheduleContext.Provider>
  );
};
