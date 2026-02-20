import {
  Inject,
  type PopupOpenEventArgs,
  ResourceDirective,
  ResourcesDirective,
  ScheduleComponent,
  TimelineMonth,
  TimelineViews,
  ViewDirective,
  ViewsDirective,
} from "@syncfusion/ej2-react-schedule";
import { useMemo, useRef } from "react";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { useBookingState } from "@hooks/useBookingState";
import { useCurrentDate } from "@hooks/useCurrentDate";
import { committees } from "@data/committees";
import { useBoundStore } from "@state/store";
import {
  type BookableItem,
  type Booking,
  type NumericBookableKeys,
} from "@/interfaces/interfaces";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";
import { convertToDate } from "@/utils/utils";
import { QuickInfoContentInventoryTemplate } from "./QuickInfoContentInventoryTemplate";
import { ScheduleContext } from "./ScheduleContext";
import { ScheduleToolbar } from "./ScheduleToolbar";
import "./localization";

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
  const bookableItemLimits = useBoundStore((state) => state.bookableItems);
  const { isPlanEditLocked } = useAdminSettings();

  const scheduleObj = useRef<ScheduleComponent>(null);

  const itemBookings = useMemo(() => {
    return (bookings ?? []).flatMap((booking) =>
      (booking?.bookableItems ?? []).map((bookableItem) => ({
        ...booking,
        id: `${booking.id}-${bookableItem.key}`,
        title: `${bookableItem.value} - Event: ${booking.title}`,
        bookingTitle: booking.title,
        ...bookableItem,
        startDate: convertToDate(bookableItem.startDate),
        endDate: convertToDate(bookableItem.endDate),
        color: committees[booking.committeeId]?.color,
        item: bookableItem.key,
      })),
    );
  }, [bookings]);

  const onEventRendered = (args: {
    element: HTMLElement;
    data: (typeof itemBookings)[number];
  }) => {
    args.element.style.backgroundColor = args.data.color ?? "#808080";
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

    if (args.type === "QuickInfo" && !args?.data?.["id"]) {
      args.cancel = true;
      return;
    }
  };

  const bookableItemsWithLimits = useMemo(
    () =>
      BOOKABLE_ITEM_OPTIONS.map((item) => {
        const key = item.key;
        if (key in bookableItemLimits) {
          return {
            ...item,
            capacity: bookableItemLimits[key as NumericBookableKeys],
          };
        }
        return item;
      }),
    [bookableItemLimits],
  );

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
          readonly={isPlanEditLocked}
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
          endHour="24:00"
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
          resourceHeaderTemplate={ResourceHeaderTemplate}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="key"
              title="Inventarie"
              name="bookableItems"
              allowMultiple={true}
              dataSource={bookableItemsWithLimits}
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

const ResourceHeaderTemplate = (props: {
  resourceData: Booking & BookableItem & { capacity?: number };
}) => {
  const capacity = props.resourceData.capacity;
  return (
    <div className="template-wrap">
      <div className="room-name text-base font-semibold">
        {props.resourceData.value}
      </div>
      <div className="room-type">
        {capacity ? `Maxkapacitet: ${capacity} st` : ""}
      </div>
    </div>
  );
};
