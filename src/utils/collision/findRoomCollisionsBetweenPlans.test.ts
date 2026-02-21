import { beforeEach, describe, expect, it } from "vitest";
import { locations } from "@/data/locationsData";
import type { Booking, Plan } from "@/interfaces/interfaces";
import { findRoomCollisionsBetweenPlans } from "./findRoomCollisionsBetweenPlans";

const LOCATION_ID = locations.campusValla["C-huset"].id;
const ROOM_ID = "c9394b56-0e30-4b95-a821-ac33d7e632fc";

describe("findRoomCollisionsBetweenPlans", () => {
  let plan: Plan;
  let event: Booking;

  beforeEach(() => {
    event = {
      id: "1",
      title: "Event 1",
      allDay: false,
      committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
      planId: "plan-1",
      alcohol: false,
      food: false,
      link: "https://example.com",
      bookableItems: [],
      locationId: LOCATION_ID,
      roomId: [ROOM_ID],
      startDate: new Date("2021-05-01 12:00"),
      endDate: new Date("2021-05-01 14:00"),
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies Booking;

    plan = {
      id: "plan-1",
      label: "Plan 1",
      public: false,
      committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-1",
      year: 2021,
      events: [event],
    } satisfies Plan;
  });

  // Empty cases
  it("returns empty object when no plans provided", () => {
    const collisions = findRoomCollisionsBetweenPlans([]);
    expect(collisions).toEqual({});
  });

  it("returns empty object when single plan provided", () => {
    const collisions = findRoomCollisionsBetweenPlans([plan]);
    expect(collisions).toEqual({});
  });

  // Time overlap scenarios
  it("returns collision when events in different plans overlap in time and share room", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(Object.keys(collisions)).toHaveLength(2);
    expect(collisions["plan-1"]).toHaveLength(1);
    expect(collisions["plan-2"]).toHaveLength(1);
  });

  it("no collision when events do not overlap in time", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      startDate: new Date("2021-05-01 14:30"),
      endDate: new Date("2021-05-01 16:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(collisions).toEqual({});
  });

  it("collision when one event is entirely contained within another", () => {
    const event1: Booking = {
      ...event,
      startDate: new Date("2021-05-01 10:00"),
      endDate: new Date("2021-05-01 18:00"),
    };

    const plan1: Plan = {
      ...plan,
      events: [event1],
    };

    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      startDate: new Date("2021-05-01 12:00"),
      endDate: new Date("2021-05-01 14:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan1, plan2]);

    expect(Object.keys(collisions)).toHaveLength(2);
    expect(collisions["plan-1"]).toHaveLength(1);
    expect(collisions["plan-2"]).toHaveLength(1);
  });

  // Room matching scenarios
  it("no collision when events overlap but use different rooms", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      roomId: ["another-room-id"],
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(collisions).toEqual({});
  });

  it("collision when events overlap and share at least one room (multiple rooms)", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      roomId: [ROOM_ID, "another-room-id"],
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(Object.keys(collisions)).toHaveLength(2);
    expect(collisions["plan-1"]).toHaveLength(1);
    expect(collisions["plan-2"]).toHaveLength(1);
  });

  it("no collision when events have empty roomId arrays", () => {
    const event1: Booking = {
      ...event,
      roomId: [],
    };

    const plan1: Plan = {
      ...plan,
      events: [event1],
    };

    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      roomId: [],
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan1, plan2]);

    expect(collisions).toEqual({});
  });

  it("no collision when events are in different locations", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      locationId: "some-other-location-id",
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(Object.keys(collisions)).toHaveLength(0);
  });

  // Output structure verification
  it("verifies both plans get entries in the result (bidirectional recording)", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    expect(collisions["plan-1"]).toBeDefined();
    expect(collisions["plan-2"]).toBeDefined();
    expect(collisions["plan-1"]!.length).toBe(1);
    expect(collisions["plan-2"]!.length).toBe(1);
  });

  it("verifies collidingRooms array contains the correct overlapping room IDs", () => {
    const sharedRoom1 = "shared-room-1";
    const sharedRoom2 = "shared-room-2";

    const event1: Booking = {
      ...event,
      roomId: [sharedRoom1, sharedRoom2, "unique-room-1"],
    };

    const plan1: Plan = {
      ...plan,
      events: [event1],
    };

    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      roomId: [sharedRoom1, sharedRoom2, "unique-room-2"],
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan1, plan2]);

    const plan1Collision = collisions["plan-1"]![0]!;
    const plan2Collision = collisions["plan-2"]![0]!;

    expect(plan1Collision[0].collidingRooms.sort()).toEqual(
      [sharedRoom1, sharedRoom2].sort(),
    );
    expect(plan2Collision[0].collidingRooms.sort()).toEqual(
      [sharedRoom1, sharedRoom2].sort(),
    );
  });

  it("verifies tuple ordering: [own_booking, other_booking]", () => {
    const event2: Booking = {
      ...event,
      id: "2",
      planId: "plan-2",
      startDate: new Date("2021-05-01 13:00"),
      endDate: new Date("2021-05-01 15:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan, plan2]);

    // For plan-1, own booking should be first, other booking second
    const plan1Collision = collisions["plan-1"]![0]!;
    expect(plan1Collision[0].planId).toBe("plan-1");
    expect(plan1Collision[1].planId).toBe("plan-2");

    // For plan-2, own booking should be first, other booking second
    const plan2Collision = collisions["plan-2"]![0]!;
    expect(plan2Collision[0].planId).toBe("plan-2");
    expect(plan2Collision[1].planId).toBe("plan-1");
  });

  // Multiple collisions
  it("multiple events colliding across plans", () => {
    const event1a: Booking = {
      ...event,
      id: "1a",
      startDate: new Date("2021-05-01 10:00"),
      endDate: new Date("2021-05-01 12:00"),
    };

    const event1b: Booking = {
      ...event,
      id: "1b",
      startDate: new Date("2021-05-01 14:00"),
      endDate: new Date("2021-05-01 16:00"),
    };

    const plan1: Plan = {
      ...plan,
      events: [event1a, event1b],
    };

    const event2a: Booking = {
      ...event,
      id: "2a",
      planId: "plan-2",
      startDate: new Date("2021-05-01 11:00"),
      endDate: new Date("2021-05-01 13:00"),
    };

    const event2b: Booking = {
      ...event,
      id: "2b",
      planId: "plan-2",
      startDate: new Date("2021-05-01 15:00"),
      endDate: new Date("2021-05-01 17:00"),
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      label: "Plan 2",
      events: [event2a, event2b],
    };

    const collisions = findRoomCollisionsBetweenPlans([plan1, plan2]);

    // Each plan should have 2 collision entries (event1a<->event2a, event1b<->event2b)
    expect(collisions["plan-1"]).toHaveLength(2);
    expect(collisions["plan-2"]).toHaveLength(2);
  });

  // Performance test
  it("handles large datasets efficiently", () => {
    const numPlans = 50;
    const eventsPerPlan = 30;
    const plans: Plan[] = [];

    for (let i = 0; i < numPlans; i++) {
      const planEvents: Booking[] = [];
      for (let j = 0; j < eventsPerPlan; j++) {
        planEvents.push({
          id: `event-${i}-${j}`,
          title: `Event ${i}-${j}`,
          allDay: false,
          committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
          planId: `plan-${i}`,
          alcohol: false,
          food: false,
          link: "https://example.com",
          bookableItems: [],
          locationId: LOCATION_ID,
          roomId: [`room-${j % 2 === 0 ? 0 : j}`],
          startDate: new Date(`2021-05-01T12:00:00`),
          endDate: new Date(`2021-05-01T14:00:00`),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      plans.push({
        id: `plan-${i}`,
        label: `Plan ${i}`,
        public: false,
        committeeId: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: `user-${i}`,
        year: 2021,
        events: planEvents,
      });
    }

    const start = performance.now();

    const collisions = findRoomCollisionsBetweenPlans(plans);

    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(2500);
    // With 50 plans, each having 30 events with half sharing room-0,
    // we should have collisions recorded
    expect(Object.keys(collisions).length).toBeGreaterThan(0);
  });
});
