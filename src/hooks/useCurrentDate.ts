import { useBoundStore } from "@/state/store";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { useAdminSettings } from "./useAdminSettings";
import { useStoreUser } from "./useStoreUser";

export const useCurrentDate = () => {
  const currentDate = useBoundStore((state) => state.currentDate);
  const updatedCurrentDate = useBoundStore((state) => state.updatedCurrentDate);
  const { mottagningStart } = useAdminSettings();
  const { user } = useStoreUser();
  const planYear = useBoundStore((state) => state.planYear);

  const resetCurrentDate = () => {
    if (planYear === CURRENT_YEAR) {
      updatedCurrentDate(mottagningStart[user.kår]);
    } else {
      updatedCurrentDate(new Date(`${planYear}-08-18`));
    }
  };

  return {
    currentDate,
    updatedCurrentDate,
    resetCurrentDate,
  };
};
