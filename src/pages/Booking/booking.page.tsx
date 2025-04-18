import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { useBoundStore } from "@state/store";
import { Layout } from "@components/molecules/layout";
import { viewCollisionsPath, viewPath } from "@/utils/CONSTANTS";
import { isInventoryCollisionView, isRoomCollisionView } from "@/utils/helpers";
import { Schedule } from "./components/Schedule";

export const BookingPage = () => {
  const { id = "" } = useParams();
  const { refetch } = usePublicPlans();
  const updatedActivePlans = useBoundStore((state) => state.updatedActivePlans);

  useEffect(() => {
    if (![viewPath, viewCollisionsPath].includes(id)) return;

    void refetch().then(({ data }) => {
      if (data)
        updatedActivePlans({
          plans: data,
          isCollisionView: isRoomCollisionView(id),
          isInventoryView: isInventoryCollisionView(location.pathname),
        });
    });
  }, []);

  return (
    <Layout className="bg-white p-0!" hideFooter>
      <Schedule />
    </Layout>
  );
};
