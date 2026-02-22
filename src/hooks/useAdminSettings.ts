import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";
import { type Kår } from "@/interfaces/interfaces";
import { adminService } from "@/services";
import { mottagningStartAtom } from "@/state/atoms";
import { CURRENT_YEAR, DEFAULT_ITEMS } from "@/utils/constants";
import { useActiveYear } from "./useActiveYear";
import { useStoreUser } from "./useStoreUser";

const adminSettingsQueryKey = ["adminSettings"];

export const useAdminSettings = () => {
  const { user } = useStoreUser();
  const { activeYear } = useActiveYear();
  const [mottagningStart, setMottagningStart] = useAtom(mottagningStartAtom);

  const { data: adminSettings, refetch: refetchAdminSettings } = useQuery({
    queryKey: adminSettingsQueryKey,
    queryFn: async () => {
      const settings = await adminService.getAdminSettings();
      return settings;
    },
    gcTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const updateLockedKårPlans = useMutation({
    mutationFn: ({ kår, newValue }: { kår: Kår; newValue: boolean }) =>
      adminService.lockAndUnlockPlans(newValue, kår),
    onSuccess: (_, { kår, newValue }) => {
      toast.success(
        newValue
          ? `Låst redigering av planeringar för ${kår}`
          : `Låst upp redigering av planeringar för ${kår}`,
      );
      refetchAdminSettings();
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
      refetchAdminSettings();
    },
    onError: () => {
      toast.error("Kunde inte ändra bokningsbara material");
    },
  });

  const updateMottagningStart = useMutation({
    mutationFn: ({ date, kår }: { date: Date; kår: Kår }) =>
      adminService.updateMottagningStart(date, kår),
    onSuccess: (value) => {
      toast.success(`Mottagningsstart för ${value.kår} ändrad`);
      refetchAdminSettings();
    },
    onError: () => {
      toast.error("Kunde inte ändra mottagningsstart");
    },
  });

  const planEditLocked = adminSettings?.planEditLocked ?? {
    Consensus: false,
    StuFF: false,
    LinTek: false,
    Övrigt: false,
  };

  const bookableItems = adminSettings?.bookableItems ?? DEFAULT_ITEMS;

  useEffect(() => {
    if (!adminSettings?.mottagningStart) return;
    setMottagningStart(adminSettings.mottagningStart);
  }, [mottagningStart]);

  return {
    updateLockedKårPlans,
    updateMottagningStart,
    updateBookableItems,
    settings: {
      planEditLocked: planEditLocked,
      mottagningStart,
      bookableItems,
    },
    isPlanEditLocked: planEditLocked[user.kår] || activeYear < CURRENT_YEAR,
  };
};
