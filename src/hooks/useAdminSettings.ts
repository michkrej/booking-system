import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminService } from "@/services";
import { type Kår } from "@/utils/interfaces";
import { useStoreAdminSettings } from "./useStoreAdminSettings";

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

  const res = useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const settings = await adminService.getAdminSettings();
      loadedAdminSettings(settings);
      return settings;
    },
    staleTime: Infinity,
  });

  const lockPlans = useMutation({
    mutationFn: (newValue: boolean) =>
      adminService.lockAndUnlockPlans(newValue),
    onSuccess: (value) => {
      updatedPlanEditLock(value);
      toast.success(
        value
          ? "Låst redigering av bokningar"
          : "Låst upp redigering av bokningar",
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
  };
};
