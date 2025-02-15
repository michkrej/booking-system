import { faker } from "@faker-js/faker";
import { addDays, addHours, differenceInCalendarDays } from "date-fns";
import { type Booking, type Location } from "./interfaces";
import { locationsValla } from "@/data/campusValla/campusValla";

/**
 * Generates a list of fake appointments with ensured start before end dates.
 *
 * @param num - Number of appointments to generate
 * @param resources - Array of resources each appointment can be associated with
 * @returns Array of Appointment objects
 */
const generateEvents = (num: number, locations: Location[]): Booking[] => {
  return Array.from({ length: num }, (_, i) => {
    const location = faker.helpers.arrayElement(locations); // Randomly pick one resource
    const start = faker.date.soon({
      days: faker.number.int({ min: 1, max: 1 }),
      refDate: new Date(),
    }); // Start date within the next two weeks
    let end = new Date(start.getTime()); // Ensure end is at least the same as start

    // Randomly decide to add between 1 hour to 48 hours to the start time for the end time
    const hoursToAdd = faker.number.int({ min: 1, max: 8 });
    end = addHours(end, hoursToAdd);

    // Ensure the appointment does not accidentally exceed two weeks from now
    if (differenceInCalendarDays(end, new Date()) > 14) {
      end = addDays(new Date(), 14); // Cap at two weeks from today
    }

    return {
      id: faker.string.uuid(),
      subject: faker.company.catchPhrase(),
      startTime: start,
      endTime: end,
      locationId:
        locationsValla[location.name as keyof typeof locationsValla].id,
    };
  });
};
export { generateEvents };
