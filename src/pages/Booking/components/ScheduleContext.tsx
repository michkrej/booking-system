import { ScheduleComponent } from "@syncfusion/ej2-react-schedule";
import { createContext } from "react";
import type { Location, Room } from "@/interfaces/interfaces";
import type { View } from "./ScheduleToolbar";

type ScheduleContextType = {
  schedule: React.RefObject<ScheduleComponent>;
  currentView: View;
  chosenCampus: "US" | "Valla";
  building: Location | undefined;
  setCurrentView: (view: View) => void;
  setChosenCampus: (campus: "US" | "Valla") => void;
  setBuilding: (building: Location | undefined) => void;
  locations: Location[];
  rooms: Room[];
};

export const ScheduleContext = createContext<ScheduleContextType>(
  {} as ScheduleContextType,
);
