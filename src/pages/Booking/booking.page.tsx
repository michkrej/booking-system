import { Layout } from "@components/molecules/layout";
import { useRefreshTimelineEvents } from "@/hooks/useRefreshTimelineEvents";
import { Schedule } from "./components/Schedule";

export const BookingPage = () => {
  useRefreshTimelineEvents();

  return (
    <Layout className="bg-white p-0!" hideFooter>
      <Schedule />
    </Layout>
  );
};
