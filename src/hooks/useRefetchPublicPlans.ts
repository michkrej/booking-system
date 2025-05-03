import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useBoundStore } from "@/state/store";
import { viewCollisionsPath, viewPath } from "@/utils/CONSTANTS";
import { isInventoryCollisionView, isRoomCollisionView } from "@/utils/helpers";
import { usePublicPlans } from "./usePublicPlans";

export const useRefetchPublicPlans = () => {
  const { id = "" } = useParams();
  const location = useLocation();
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
};
