import {
  areIntervalsOverlapping,
  formatDate as formatDateFns,
  interval,
} from "date-fns";
import { sv } from "date-fns/locale";

/**
 * Returns the date range overlaps between two sets ofdate ranges.
 * @param {[Date, Date]} range1 - Start and end date of sample
 * @param {[Date, Date]} range2 - Start and end date of target
 * @returns {[Date, Date] | null}
 */
const getDateRangeOverLaps = (
  range1: [Date, Date],
  range2: [Date, Date],
): [Date, Date] | null => {
  const [start1, end1] = range1;
  const [start2, end2] = range2;

  if (
    !areIntervalsOverlapping(interval(start1, end1), interval(start2, end2))
  ) {
    return null;
  }

  const start1Time = start1.getTime();
  const end1Time = end1.getTime();
  const start2Time = start2.getTime();
  const end2Time = end2.getTime();

  // range 1 spans whole range 2
  if (start1Time <= start2Time && end1Time >= end2Time) {
    return [start2, end2];
  }

  // range 1 completely within range 2
  if (start1Time >= start2Time && end1Time <= end2Time) {
    return [start1, end1];
  }

  // range 1 starts before range 2 and ends within range 2
  if (start1Time <= start2Time && end1Time <= end2Time) {
    return [start2, end1];
  }

  // range 1 starts within range 2 and ends after range 2
  if (start1Time >= start2Time && end1Time >= end2Time) {
    return [start1, end2];
  }

  return null;
};

const formatDate = (date: Date, format: "full" | "short") => {
  if (format === "full") {
    return formatDateFns(date, "d MMM HH:mm", {
      locale: sv,
    });
  }

  return formatDateFns(date, "HH:mm", {
    locale: sv,
  });
};

export { getDateRangeOverLaps, formatDate };
