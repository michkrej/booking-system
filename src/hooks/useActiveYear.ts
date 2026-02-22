import { useAtom } from "jotai";
import { activeYearAtom } from "@/state/atoms";
import { MAX_YEAR, MIN_YEAR } from "@/utils/constants";

const useActiveYear = () => {
  const [activeYear, setActiveYear] = useAtom(activeYearAtom);

  const incrementActiveYear = () => {
    const newYear = activeYear + 1;

    if (newYear > MAX_YEAR) {
      throw new Error("Year out of bounds");
    }

    setActiveYear(newYear);
  };

  const decrementActiveYear = () => {
    const newYear = activeYear - 1;

    if (newYear < MIN_YEAR) {
      throw new Error("Year out of bounds");
    }

    setActiveYear(newYear);
  };

  return {
    activeYear,
    incrementActiveYear,
    decrementActiveYear,
  };
};

export { useActiveYear };
