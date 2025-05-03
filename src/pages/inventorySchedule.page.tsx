import { Layout } from "@components/molecules/layout";
import { useRefetchPublicPlans } from "@/hooks/useRefetchPublicPlans";
import { InventorySchedule } from "./Booking/components/InventorySchedule";

export const InventorySchedulePage = () => {
  useRefetchPublicPlans();

  return (
    <Layout className="bg-white p-0!" hideFooter>
      <InventorySchedule />
    </Layout>
  );
};
