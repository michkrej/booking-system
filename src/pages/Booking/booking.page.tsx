import { Layout } from "@components/molecules/layout";
import { useRefetchPublicPlans } from "@/hooks/useRefetchPublicPlans";
import { Schedule } from "./components/Schedule";

export const BookingPage = () => {
  useRefetchPublicPlans();

  return (
    <Layout className="bg-white p-0!" hideFooter>
      <Schedule />
    </Layout>
  );
};
