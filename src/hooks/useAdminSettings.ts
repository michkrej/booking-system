import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminService, type AdminSettings } from "@/services";
import {
  useMottagningStart,
  usePlanEditLock,
  useSetAdminSettings,
} from "@/state/store";
import { type Kår } from "@/utils/interfaces";
import { useEffect } from "react";

export const useAdminSettings = () => {
  const setAdminSettings = useSetAdminSettings();
  const { setPlanEditLock } = usePlanEditLock();
  const { setMottagningStart } = useMottagningStart();

  const { data: adminSettings } = useQuery<AdminSettings>({
    queryKey: ["adminSettings"],
    queryFn: () => adminService.getAdminSettings(),
  });

  useEffect(() => {
    if (adminSettings) {
      setAdminSettings({
        lockPlans: adminSettings.lockPlans,
        mottagningStart: {
          Consensus: adminSettings.mottagningStart.Consensus.toDate(),
          StuFF: adminSettings.mottagningStart.StuFF.toDate(),
          LinTek: adminSettings.mottagningStart.LinTek.toDate(),
          Övrigt: new Date(), // this field is not used in the app, I'm too lazy to remove it
        },
        bookableItems: adminSettings.bookableItems,
      });
    }
  }, [adminSettings, setAdminSettings]);

  const lockPlans = useMutation({
    mutationFn: (newValue: boolean) =>
      adminService.lockAndUnlockPlans(newValue),
    onSuccess: (value) => {
      setPlanEditLock(value);
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
    onSuccess: () => {
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
      setMottagningStart(value.date, value.kår);
      toast.success(`Mottagningsstart för ${value.kår} ändrad`);
    },
    onError: () => {
      toast.error("Kunde inte ändra mottagningsstart");
    },
  });

  return {
    lockPlans,
    updateMottagningStart,
    updateBookableItems,
    settings: adminSettings,
  };
};
