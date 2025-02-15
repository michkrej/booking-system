import { Layout } from "@/components/molecules/layout";
import { generateEvents } from "@/utils/fakeData";
import { useEffect, useState } from "react";
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
} from "@syncfusion/ej2-react-schedule";
import { type Booking } from "@/utils/interfaces";
import { locationsValla } from "@/data/campusValla/campusValla";

// Docs for this https://ej2.syncfusion.com/react/demos/#/bootstrap5/schedule/timeline-resources

export const BookingPage = () => {
  const [appointments, setAppointments] = useState<Booking[]>([]);

  const locations = Object.values(locationsValla);

  useEffect(() => {
    const initAppointments = generateEvents(15, locations); // Generate 20 appointments linked to the resources
    console.log(initAppointments);
    setAppointments(initAppointments);
  }, []);

  return (
    <Layout className="!p-4">
      <div className="h-[calc(100vh-160px)]">
        <ScheduleComponent
          cssClass="timeline-resource"
          width="100%"
          height="100%"
          workHours={{ highlight: false }}
          timeScale={{ interval: 120, slotCount: 1 }}
          showTimeIndicator={false}
          startHour="06:00"
          endHour="23:00"
          eventSettings={{
            dataSource: appointments,
            fields: {
              id: "name",
              subject: { title: "Summary", name: "subject" },
              description: { title: "Comments", name: "description" },
              startTime: { title: "From", name: "startTime" },
              endTime: { title: "To", name: "endTime" },
            },
          }}
          timezone="Europe/Stockholm"
          group={{ enableCompactView: false, resources: ["MeetingRoom"] }}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="locationId"
              title="Room Type"
              name="MeetingRoom"
              allowMultiple={true}
              dataSource={locations}
              textField="name"
              idField="id"
              colorField="color"
            />
          </ResourcesDirective>
          <ViewsDirective>
            <ViewDirective option="TimelineDay" />
            <ViewDirective option="TimelineWeek" />
          </ViewsDirective>
          <Inject services={[TimelineViews, Resize, DragAndDrop]} />
        </ScheduleComponent>
      </div>
    </Layout>
  );
};
