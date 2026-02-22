import { Layout } from "@components/molecules/layout";
import { useRefreshTimelineEvents } from "@/hooks/useRefreshTimelineEvents";
import { InventorySchedule } from "./Booking/components/InventorySchedule";

export const InventorySchedulePage = () => {
  useRefreshTimelineEvents();

  return (
    <Layout className="bg-white p-0!" hideFooter>
      <InventorySchedule />
    </Layout>
  );
};
