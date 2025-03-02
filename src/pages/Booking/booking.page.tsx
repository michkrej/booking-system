import { Layout } from "@/components/molecules/layout";
import { Schedule } from "./components/Schedule";

export const BookingPage = () => {
  return (
    <Layout className="bg-white !p-0" hideFooter>
      <Schedule />
    </Layout>
  );
};
