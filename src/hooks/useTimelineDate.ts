import { useAtom, useAtomValue } from "jotai";
import { mottagningStartAtom, timelineDateAtom, userAtom } from "@/state/atoms";
import { CURRENT_YEAR } from "@/utils/constants";
import { getMottagningStartWeek } from "@/utils/helpers";
import { getCommittee } from "@/utils/utils";
import { useActiveYear } from "./useActiveYear";

const useTimelineDate = () => {
  const [timelineDate, setTimelineDate] = useAtom(timelineDateAtom);
  const mottagningStart = useAtomValue(mottagningStartAtom);
  const { activeYear } = useActiveYear();
  const user = useAtomValue(userAtom)!;

  const committee = getCommittee(user.committeeId)!;

  const resetTimelineDate = () => {
    if (activeYear === CURRENT_YEAR) {
      setTimelineDate(mottagningStart[committee.kår]);
    } else {
      setTimelineDate(getMottagningStartWeek());
    }
  };

  return {
    timelineDate,
    setTimelineDate,
    resetTimelineDate,
  };
};

export { useTimelineDate };
