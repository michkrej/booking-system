import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Kår } from "@/interfaces/interfaces";
import { adminService } from "@/services";
import { CURRENT_YEAR } from "@/utils/constants";
import { useStoreAdminSettings } from "./useStoreAdminSettings";
import { useStorePlanYear } from "./useStorePlanYear";
import { useStoreUser } from "./useStoreUser";

export const useAdminSettings = () => {
  const {
    bookableItems,
    planEditLocked,
    mottagningStart,
    updatedBookableItems,
    updatedMottagningStartDateForKår,
    updatedPlanEditLock,
    loadedAdminSettings,
  } = useStoreAdminSettings();
  const { user } = useStoreUser();
  const { planYear } = useStorePlanYear();

  useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const settings = await adminService.getAdminSettings();
      loadedAdminSettings(settings);
      return settings;
    },
    gcTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const lockPlans = useMutation({
    mutationFn: ({ kår, newValue }: { kår: Kår; newValue: boolean }) =>
      adminService.lockAndUnlockPlans(newValue, kår),
    onSuccess: (_, { kår, newValue }) => {
      updatedPlanEditLock(newValue, kår);
      toast.success(
        newValue
          ? `Låst redigering av planeringar för ${kår}`
          : `Låst upp redigering av planeringar för ${kår}`,
      );
    },
    onError: () => {
      toast.error("Kunde inte låsa/upplåsa redigering av bokningar");
    },
  });

  const updateBookableItems = useMutation({
    mutationFn: (newItems: Record<string, number>) =>
      adminService.updateBookableItems(newItems),
    onSuccess: (value) => {
      updatedBookableItems(value);
      toast.success("Bokningsbara material har ändrats");
    },
    onError: () => {
      toast.error("Kunde inte ändra bokningsbara material");
    },
  });

  const updateMottagningStart = useMutation({
    mutationFn: ({ date, kår }: { date: Date; kår: Kår }) =>
      adminService.updateMottagningStart(date, kår),
    onSuccess: (value) => {
      updatedMottagningStartDateForKår(value.date, value.kår);
      toast.success(`Mottagningsstart för ${value.kår} ändrad`);
    },
    onError: () => {
      toast.error("Kunde inte ändra mottagningsstart");
    },
  });

  return {
    planEditLocked,
    mottagningStart,
    bookableItems,
    lockPlans,
    updateMottagningStart,
    updateBookableItems,
    settings: {
      lockPlans: planEditLocked,
      mottagningStart,
      bookableItems,
    },
    isPlanEditLocked: planEditLocked[user.kår] || planYear < CURRENT_YEAR,
  };
};
