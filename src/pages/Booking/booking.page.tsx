import { Layout } from "@/components/molecules/layout";
import { Schedule } from "./components/Schedule";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { useBoundStore } from "@/state/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const BookingPage = () => {
  const { id } = useParams();
  const { refetch } = usePublicPlans();
  const updatedActivePlans = useBoundStore((state) => state.updatedActivePlans);

  useEffect(() => {
    if (!["view", "view-collisions"].includes(id ?? "")) return;

    void refetch().then(({ data }) => {
      if (data)
        updatedActivePlans({
          plans: data,
          isCollisionView: id === "view-collisions",
          isInventoryView: location.pathname.includes("inventory"),
        });
    });
  }, []);

  return (
    <Layout className="bg-white !p-0" hideFooter>
      <Schedule />
    </Layout>
  );
};
