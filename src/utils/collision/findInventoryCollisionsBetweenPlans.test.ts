import { beforeEach, describe, expect, it } from "vitest";
import type { Booking, Plan } from "@/interfaces/interfaces";
import { DEFAULT_ITEMS } from "../constants";
import { findInventoryCollisionsBetweenPlans as _findInventoryCollisionsBetweenPlans } from "./findInventoryCollisionsBetweenPlans";

const findInventoryCollisionsBetweenPlans = (plans: Plan[]) => {
  return _findInventoryCollisionsBetweenPlans(plans, DEFAULT_ITEMS);
};

describe("findInventoryCollisionsBetweenPlans", () => {
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
      locationId: "location-1",
      roomId: ["room-1"],
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
    const collisions = findInventoryCollisionsBetweenPlans([]);
    expect(collisions).toEqual({});
  });

  it("returns empty object when single plan provided", () => {
    const collisions = findInventoryCollisionsBetweenPlans([plan]);
    expect(collisions).toEqual({});
  });

  it("returns empty object when plans have no bookable items", () => {
    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      events: [{ ...event, id: "2", planId: "plan-2" }],
    };

    const collisions = findInventoryCollisionsBetweenPlans([plan, plan2]);
    expect(collisions).toEqual({});
  });

  // Text item collision scenarios
  describe("text item collisions", () => {
    it("returns collision when text items with same key overlap in time and are from different plans", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "ff",
            value: "Scen",
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      expect(Object.keys(collisions)).toHaveLength(2);
      expect(collisions["plan-1"]).toHaveLength(1);
      expect(collisions["plan-2"]).toHaveLength(1);
    });

    it("no collision when text items have different keys", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "forte",
            value: "Speaker",
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);
      expect(collisions).toEqual({});
    });

    it("no collision when text items do not overlap in time", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 15:00"),
            endDate: new Date("2021-05-01 17:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);
      expect(collisions).toEqual({});
    });
  });

  // Numeric item collision scenarios
  describe("numeric item collisions", () => {
    it("returns collision when numeric items sum exceeds limit", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "numeric",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "grillar",
            value: 4,
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "numeric",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      // 5 + 4 = 9 > 8 (DEFAULT_ITEMS.grillar)
      expect(Object.keys(collisions)).toHaveLength(2);
      expect(collisions["plan-1"]).toHaveLength(1);
      expect(collisions["plan-2"]).toHaveLength(1);
    });

    it("no collision when numeric items sum equals limit exactly", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "grillar",
            value: 4,
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "numeric",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "grillar",
            value: 4,
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "numeric",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      // 4 + 4 = 8 = DEFAULT_ITEMS.grillar, no collision
      expect(collisions).toEqual({});
    });

    it("no collision when numeric items do not overlap in time", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "numeric",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2021-05-01 15:00"),
            endDate: new Date("2021-05-01 17:00"),
            type: "numeric",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);
      expect(collisions).toEqual({});
    });
  });

  // Dual-storage pattern verification
  describe("dual-storage pattern", () => {
    it("both plans have collision entries", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "ff",
            value: "Scen",
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      expect(collisions["plan-1"]).toBeDefined();
      expect(collisions["plan-2"]).toBeDefined();
      expect(collisions["plan-1"]!.length).toBe(1);
      expect(collisions["plan-2"]!.length).toBe(1);
    });

    it("tuple ordering: [own_booking, other_booking]", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "ff",
            value: "Scen",
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      // For plan-1, own booking should be first, other booking second
      const plan1Collision = collisions["plan-1"]![0]!;
      expect(plan1Collision[0].planId).toBe("plan-1");
      expect(plan1Collision[1].planId).toBe("plan-2");

      // For plan-2, own booking should be first, other booking second
      const plan2Collision = collisions["plan-2"]![0]!;
      expect(plan2Collision[0].planId).toBe("plan-2");
      expect(plan2Collision[1].planId).toBe("plan-1");
    });
  });

  // collidingItems verification
  describe("collidingItems metadata", () => {
    it("collidingItems contains correct item metadata for text items", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "text",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "ff",
            value: "Scen",
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "text",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      const plan1Collision = collisions["plan-1"]![0]!;
      expect(plan1Collision[0].collidingItems).toHaveLength(1);
      expect(plan1Collision[0].collidingItems[0]!.key).toBe("ff");
    });

    it("collidingItems contains correct item metadata for numeric items", () => {
      const event1: Booking = {
        ...event,
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2021-05-01 12:00"),
            endDate: new Date("2021-05-01 14:00"),
            type: "numeric",
          },
        ],
      };

      const plan1: Plan = { ...plan, events: [event1] };

      const event2: Booking = {
        ...event,
        id: "2",
        planId: "plan-2",
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2021-05-01 13:00"),
            endDate: new Date("2021-05-01 15:00"),
            type: "numeric",
          },
        ],
      };

      const plan2: Plan = {
        ...plan,
        id: "plan-2",
        events: [event2],
      };

      const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

      const plan1Collision = collisions["plan-1"]![0]!;
      expect(plan1Collision[0].collidingItems).toHaveLength(1);
      expect(plan1Collision[0].collidingItems[0]!.key).toBe("grillar");
    });
  });

  // Multiple collisions
  it("handles multiple collisions across plans", () => {
    const event1a: Booking = {
      ...event,
      id: "1a",
      bookableItems: [
        {
          key: "ff",
          value: "Elverk",
          startDate: new Date("2021-05-01 10:00"),
          endDate: new Date("2021-05-01 12:00"),
          type: "text",
        },
      ],
    };

    const event1b: Booking = {
      ...event,
      id: "1b",
      bookableItems: [
        {
          key: "forte",
          value: "Speaker",
          startDate: new Date("2021-05-01 14:00"),
          endDate: new Date("2021-05-01 16:00"),
          type: "text",
        },
      ],
    };

    const plan1: Plan = { ...plan, events: [event1a, event1b] };

    const event2a: Booking = {
      ...event,
      id: "2a",
      planId: "plan-2",
      bookableItems: [
        {
          key: "ff",
          value: "Scen",
          startDate: new Date("2021-05-01 11:00"),
          endDate: new Date("2021-05-01 13:00"),
          type: "text",
        },
      ],
    };

    const event2b: Booking = {
      ...event,
      id: "2b",
      planId: "plan-2",
      bookableItems: [
        {
          key: "forte",
          value: "Mikrofon",
          startDate: new Date("2021-05-01 15:00"),
          endDate: new Date("2021-05-01 17:00"),
          type: "text",
        },
      ],
    };

    const plan2: Plan = {
      ...plan,
      id: "plan-2",
      events: [event2a, event2b],
    };

    const collisions = findInventoryCollisionsBetweenPlans([plan1, plan2]);

    // Each plan should have 2 collision entries
    expect(collisions["plan-1"]).toHaveLength(2);
    expect(collisions["plan-2"]).toHaveLength(2);
  });

  // Performance test
  it("handles large datasets efficiently", () => {
    const numPlans = 50;
    const eventsPerPlan = 10;
    const plans: Plan[] = [];

    for (let i = 0; i < numPlans; i++) {
      const planEvents: Booking[] = [];
      for (let j = 0; j < eventsPerPlan; j++) {
        planEvents.push({
          ...event,
          id: `event-${i}-${j}`,
          planId: `plan-${i}`,
          bookableItems: [
            {
              key: "grillar",
              value: 5,
              startDate: new Date("2021-05-01 12:00"),
              endDate: new Date("2021-05-01 14:00"),
              type: "numeric",
            },
          ],
        });
      }
      plans.push({
        ...plan,
        id: `plan-${i}`,
        label: `Plan ${i}`,
        events: planEvents,
      });
    }

    const start = performance.now();
    const collisions = findInventoryCollisionsBetweenPlans(plans);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(2500);
    // With many overlapping grillar items exceeding limit, we should have collisions
    expect(Object.keys(collisions).length).toBeGreaterThan(0);
  });
});
