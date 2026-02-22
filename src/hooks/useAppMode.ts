import { useAtom } from "jotai";
import { appModeAtom } from "@/state/atoms";

export const useAppMode = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom);

  const changeAppMode = (newMode: "user" | "spectator") => {
    setAppMode(newMode);
  };

  return {
    appMode,
    changeAppMode,
  };
};
