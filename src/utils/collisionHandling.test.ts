import { describe, expect, it, beforeEach } from "vitest";
import {
  LOCATION_ID,
  CORRIDOR_IDS,
  createItemsObject,
  eventsUseSameRooms,
  findCollisionBetweenEvents,
  getEventsWithTooManyItems,
  increaseItemsUse,
  isCollisionBetweenRoomAndCorridor,
} from "./collisionHandling";
import { type Booking } from "./interfaces";

describe("collisionHandling", () => {
  let event: Booking;

  beforeEach(() => {
    event = {
      id: "1",
      title: "Event 1",
      allDay: false,

      committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
      planId: "1",

      grillar: 2,
      bardiskar: 0,
      "bankset-k": 0,
      "bankset-hg": 0,
      "bankset-hoben": 0,
      "ff-trailer": 1,
      "ff-elverk": 0,
      "ff-tents": 0,
      scenes: 0,
      alcohol: false,
      food: false,

      link: "https://example.com",
      annat: "Annat",

      locationId: LOCATION_ID,
      roomId: ["c9394b56-0e30-4b95-a821-ac33d7e632fc"],
      startDate: new Date("2021-05-01 12:00"),
      endDate: new Date("2021-05-01 14:00"),

      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies Booking;
  });

  describe("createItemsObject", () => {
    it("creates object with correct sums and adds event to array", () => {
      const items = createItemsObject(event);

      // Check that sums are correct
      expect(items.grillar.sum).toBe(2);
      expect(items["ff-trailer"].sum).toBe(1);
      expect(items.scenes.sum).toBe(0);
      expect(items["ff-elverk"].sum).toBe(0);
      expect(items["ff-tents"].sum).toBe(0);
      expect(items["bankset-hg"].sum).toBe(0);
      expect(items["bankset-k"].sum).toBe(0);
      expect(items["bankset-hoben"].sum).toBe(0);
      expect(items.bardiskar.sum).toBe(0);

      // Check that events are empty
      expect(items.grillar.events).toEqual([event]);
      expect(items["ff-trailer"].events).toEqual([event]);
      expect(items.scenes.events).toEqual([]);
      expect(items["ff-elverk"].events).toEqual([]);
      expect(items["ff-tents"].events).toEqual([]);
      expect(items["bankset-hg"].events).toEqual([]);
      expect(items["bankset-k"].events).toEqual([]);
      expect(items["bankset-hoben"].events).toEqual([]);
      expect(items.bardiskar.events).toEqual([]);
    });
  });

  describe("increaseItemsUse", () => {
    it("increases sum and adds event to event array", () => {
      const items = createItemsObject(event);
      const event2 = {
        ...event,
        id: "2",
        grillar: 3,
        "ff-trailer": 0,
      } satisfies Booking;

      increaseItemsUse(items, event2);

      // Check that sums are correct
      expect(items.grillar.sum).toBe(5);
      expect(items["ff-trailer"].sum).toBe(1);
      expect(items.scenes.sum).toBe(0);
      expect(items["ff-elverk"].sum).toBe(0);
      expect(items["ff-tents"].sum).toBe(0);
      expect(items["bankset-hg"].sum).toBe(0);
      expect(items["bankset-k"].sum).toBe(0);
      expect(items["bankset-hoben"].sum).toBe(0);
      expect(items.bardiskar.sum).toBe(0);

      // Check that events are correct
      expect(items.grillar.events).toEqual([event, event2]);
      expect(items["ff-trailer"].events).toEqual([event]);
      expect(items.scenes.events).toEqual([]);
      expect(items["ff-elverk"].events).toEqual([]);
      expect(items["ff-tents"].events).toEqual([]);
      expect(items["bankset-hg"].events).toEqual([]);
      expect(items["bankset-k"].events).toEqual([]);
      expect(items["bankset-hoben"].events).toEqual([]);
      expect(items.bardiskar.events).toEqual([]);
    });
  });

  describe("getEventsWithTooManyItems", () => {
    it("returns undefined if no items are over limit", () => {
      const items = createItemsObject(event);
      const events = getEventsWithTooManyItems(items);

      expect(events).toBeUndefined();
    });

    it("returns event if one item is over limit", () => {
      const items = createItemsObject(event);
      const event2 = {
        ...event,
        id: "2",
        grillar: 7,
      };
      increaseItemsUse(items, event2);
      const events = getEventsWithTooManyItems(items);

      expect(events).toEqual([event, event2]);
    });

    it("returns event if multiple items are over limit", () => {
      const items = createItemsObject(event);
      const event2 = {
        ...event,
        id: "2",
        grillar: 7,
        trailer: 1,
      };
      increaseItemsUse(items, event2);
      const events = getEventsWithTooManyItems(items);

      expect(events).toEqual([event, event2]);
    });
  });

  describe("isCollisionBetweenRoomAndCorridor", () => {
    it("isCollisionBetweenRoomAndCorridor returns true if room and corridor collide", () => {
      const corridorEvent = {
        ...event,
        id: "2",
        locationId: LOCATION_ID,
        roomId: CORRIDOR_IDS,
      };

      expect(isCollisionBetweenRoomAndCorridor(event, corridorEvent)).toBe(
        true,
      );
    });

    it("isCollisionBetweenRoomAndCorridor returns false if room and corridor do not collide", () => {
      const event2 = {
        ...event,
        id: "2",
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]!],
      } satisfies Booking;

      expect(isCollisionBetweenRoomAndCorridor(event, event2)).toBe(false);
    });
  });

  describe("eventsUseSameRooms", () => {
    it("eventsUseSameRoom returns true if events use same room", () => {
      expect(eventsUseSameRooms(event, event)).toBe(true);
    });

    it("eventsUseSameRoom returns false if events do not use same room", () => {
      const event2 = {
        ...event,
        id: "2",
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]!],
      } satisfies Booking;

      expect(eventsUseSameRooms(event, event2)).toBe(false);
    });
  });

  describe("findCollidingEvents", () => {
    it("returns empty set if no events collide", () => {
      const items = createItemsObject(event);
      const event2 = {
        ...event,
        id: "2",
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]!],
        "ff-trailer": 0,
      } satisfies Booking;
      const collidingEvents = findCollisionBetweenEvents(event, event2, items);

      expect(collidingEvents).toEqual(new Set());
    });

    it("returns a set of colliding events when events collide in terms of time and location", () => {
      const event2 = {
        ...event,
        id: "2",
        "ff-trailer": 0,
        startDate: new Date("2021-05-01 13:40"),
        endDate: new Date("2021-05-01 15:00"),
      } satisfies Booking;
      const items = createItemsObject(event);
      const collidingEvents = findCollisionBetweenEvents(event, event2, items);

      expect(collidingEvents).toEqual(new Set([event, event2]));
    });

    it("returns a set of colliding events when events collide in terms of time and items", () => {
      const event2 = {
        ...event,
        id: "2",
      } satisfies Booking;

      const items = createItemsObject(event);
      increaseItemsUse(items, event2);
      const collidingEvents = findCollisionBetweenEvents(event, event2, items);

      expect(collidingEvents).toEqual(new Set([event, event2]));
    });
  });
});
