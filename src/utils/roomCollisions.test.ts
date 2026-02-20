import { beforeEach, describe, expect, it } from "vitest";
import { committees } from "@/data/committees";
import { locations } from "@/data/locationsData";
import { type Booking } from "../interfaces/interfaces";
import { findRoomCollisionsBetweenEvents } from "./roomCollisions";

const LOCATION_ID = locations.campusValla["C-huset"].id;

describe("eventCollisions", () => {
  let event: Booking;

  beforeEach(() => {
    event = {
      id: "1",
      title: "Event 1",
      allDay: false,

      committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
      planId: "1",

      alcohol: false,
      food: false,
      link: "https://example.com",
      bookableItems: [],

      locationId: LOCATION_ID,
      roomId: ["c9394b56-0e30-4b95-a821-ac33d7e632fc"],
      startDate: new Date("2021-05-01 12:00"),
      endDate: new Date("2021-05-01 14:00"),

      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies Booking;
  });

  it("returns an empty array if there are no collisions", () => {
    const collisions = findRoomCollisionsBetweenEvents([event]);

    expect(collisions).toEqual([]);
  });

  it("returns a collision when events overlap in time and use the same room", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      startDate: new Date("2021-05-01 13:00"), // Overlapping time
      endDate: new Date("2021-05-01 15:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions.length).toEqual(2); // Both events should be in the collision list
  });

  it("does not return a collision when events overlap in time but are in different rooms", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      roomId: ["another-room-id"], // Different room
      startDate: new Date("2021-05-01 13:00"), // Overlapping time
      endDate: new Date("2021-05-01 15:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions).toEqual([]); // No collision because rooms are different
  });

  it("returns a collision when events start and end at the same time and use the same room", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions.length).toEqual(2); // Both events should be in the collision list
  });

  it("does not return a collision when events are in different locations", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      locationId: "some-other-location-id", // Different location
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions).toEqual([]); // No collision because locations are different
  });

  it("returns a collision for all overlapping events", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    } satisfies Booking;

    const event3 = {
      ...event,
      id: "3",
      planId: "2",
      startDate: new Date("2021-05-01 12:30"),
      endDate: new Date("2021-05-01 14:30"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2, event3]);

    expect(collisions.length).toEqual(3); // All three events should be in the collision list
  });

  it("does not return a collision when events do not overlap in time", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      startDate: new Date("2021-05-01 14:30"),
      endDate: new Date("2021-05-01 16:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions).toEqual([]); // No collision because times do not overlap
  });

  it("returns an empty array when there are no events", () => {
    const collisions = findRoomCollisionsBetweenEvents([]);

    expect(collisions).toEqual([]); // No collisions because there are no events
  });

  it("returns an empty array when there is only one event", () => {
    const collisions = findRoomCollisionsBetweenEvents([event]);

    expect(collisions).toEqual([]); // No collision because there is only one event
  });

  it("returns a collision when events overlap and share at least one room", () => {
    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      roomId: ["c9394b56-0e30-4b95-a821-ac33d7e632fc", "another-room-id"], // Multiple rooms
      startDate: new Date("2021-05-01 13:00"), // Overlapping time
      endDate: new Date("2021-05-01 15:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event, event2]);

    expect(collisions.length).toEqual(2); // Both events should be in the collision list
  });

  it("does not return a collision when events have empty roomId arrays", () => {
    const event1 = {
      ...event,
      id: "1",
      planId: "1",
      roomId: [], // Empty roomId array
    } satisfies Booking;

    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      roomId: [], // Empty roomId array
      startDate: new Date("2021-05-01 13:00"), // Overlapping time
      endDate: new Date("2021-05-01 15:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event1, event2]);

    expect(collisions).toEqual([]); // No collision because no rooms to compare
  });

  it("returns a collision when one event is entirely contained within another", () => {
    const event1 = {
      ...event,
      id: "1",
      planId: "1",
      startDate: new Date("2021-05-01 10:00"),
      endDate: new Date("2021-05-01 18:00"),
    } satisfies Booking;

    const event2 = {
      ...event,
      id: "2",
      planId: "2",
      startDate: new Date("2021-05-01 12:00"), // Entirely within event1
      endDate: new Date("2021-05-01 14:00"),
    } satisfies Booking;

    const collisions = findRoomCollisionsBetweenEvents([event1, event2]);

    expect(collisions.length).toEqual(2); // Both events should be in the collision list
  });

  it("handles large datasets efficiently", () => {
    const numEvents = 1500;
    const events: Booking[] = [];
    for (let i = 0; i < numEvents; i++) {
      const event: Booking = {
        id: `${i}`,
        title: `Event ${i}`,
        allDay: false,
        committeeId: `committee-${i}` as keyof typeof committees,
        planId: `plan-${i}`, // Random planId
        alcohol: false,
        food: false,
        link: "https://example.com",
        bookableItems: [],
        locationId: LOCATION_ID,
        roomId: [`room-${i % 2 === 0 ? 0 : i}`],
        startDate: new Date(`2021-05-01T12:00:00`),
        endDate: new Date(`2021-05-01T14:00:00`),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      events.push(event);
    }

    const start = performance.now(); // Record the start time

    const collisions = findRoomCollisionsBetweenEvents(events);

    const end = performance.now(); // Record the end time
    const duration = end - start;

    expect(duration).toBeLessThan(2000);
    expect(collisions.length).toBe(750);
  });
});
