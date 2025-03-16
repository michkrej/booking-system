import { Layout } from "@/components/molecules/layout";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { useBoundStore } from "@/state/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { InventorySchedule } from "./Booking/components/InventorySchedule";

export const InventoryPage = () => {
  const { id } = useParams();
  const { refetch } = usePublicPlans();
  const updatedActivePlans = useBoundStore((state) => state.updatedActivePlans);

  useEffect(() => {
    if (id !== "view") return;
    void refetch().then(({ data }) => {
      if (data) updatedActivePlans(data);
    });
  }, []);

  return (
    <Layout className="bg-white !p-0" hideFooter>
      <InventorySchedule />
    </Layout>
  );
};
