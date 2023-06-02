import {
  LOCATION_ID,
  CORRIDOR_IDS,
  createItemsObject,
  eventsUseSameRooms,
  findCollisionBetweenEvents,
  getEventsWithTooManyItems,
  increaseItemsUse,
  isCollisionBetweenRoomAndCorridor
} from './collisionHandling'

describe('collisionHandling', () => {
  let event

  beforeEach(() => {
    event = {
      id: 1,
      grillar: 2,
      trailer: 1,
      locationId: LOCATION_ID,
      roomId: ['c9394b56-0e30-4b95-a821-ac33d7e632fc'],
      startDate: new Date('2021-05-01 12:00'),
      endDate: new Date('2021-05-01 14:00')
    }
  })

  describe('createItemsObject', () => {
    it('creates object with currect sums and adds event to array', () => {
      const items = createItemsObject(event)

      // Check that sums are correct
      expect(items.grillar.sum).toBe(2)
      expect(items.trailer.sum).toBe(1)
      expect(items.scene.sum).toBe(0)
      expect(items.elverk.sum).toBe(0)
      expect(items.tents.sum).toBe(0)
      expect(items['bankset-hg'].sum).toBe(0)
      expect(items['bankset-k'].sum).toBe(0)
      expect(items.bardiskar.sum).toBe(0)

      // Check that events are empty
      expect(items.grillar.events).toEqual([event])
      expect(items.trailer.events).toEqual([event])
      expect(items.scene.events).toEqual([])
      expect(items.elverk.events).toEqual([])
      expect(items.tents.events).toEqual([])
      expect(items['bankset-hg'].events).toEqual([])
      expect(items['bankset-k'].events).toEqual([])
      expect(items.bardiskar.events).toEqual([])
    })
  })

  describe('increaseItemsUse', () => {
    it('increases sum and adds event to event array', () => {
      const items = createItemsObject(event)
      const event2 = {
        id: 2,
        grillar: 1
      }

      increaseItemsUse(items, event2)

      // Check that sums are correct
      expect(items.grillar.sum).toBe(3)
      expect(items.trailer.sum).toBe(1)
      expect(items.scene.sum).toBe(0)
      expect(items.elverk.sum).toBe(0)
      expect(items.tents.sum).toBe(0)
      expect(items['bankset-hg'].sum).toBe(0)
      expect(items['bankset-k'].sum).toBe(0)
      expect(items.bardiskar.sum).toBe(0)

      // Check that events are correct
      expect(items.grillar.events).toEqual([event, event2])
      expect(items.trailer.events).toEqual([event])
      expect(items.scene.events).toEqual([])
      expect(items.elverk.events).toEqual([])
      expect(items.tents.events).toEqual([])
      expect(items['bankset-hg'].events).toEqual([])
      expect(items['bankset-k'].events).toEqual([])
      expect(items.bardiskar.events).toEqual([])
    })
  })

  describe('getEventsWithTooManyItems', () => {
    it('returns undefined if no items are over limit', () => {
      const items = createItemsObject(event)
      const events = getEventsWithTooManyItems(items)

      expect(events).toBeUndefined()
    })

    it('returns event if one item is over limit', () => {
      const items = createItemsObject(event)
      const event2 = {
        id: 2,
        grillar: 7
      }
      increaseItemsUse(items, event2)
      const events = getEventsWithTooManyItems(items)

      expect(events).toEqual([event, event2])
    })

    it('returns event if multiple items are over limit', () => {
      const items = createItemsObject(event)
      const event2 = {
        id: 2,
        grillar: 7,
        trailer: 1
      }
      increaseItemsUse(items, event2)
      const events = getEventsWithTooManyItems(items)

      expect(events).toEqual([event, event2])
    })
  })

  describe('isCollisionBetweenRoomAndCorridor', () => {
    it('isCollisionBetweenRoomAndCorridor returns true if room and corridor collide', () => {
      const corridorEvent = {
        id: 2,
        locationId: LOCATION_ID,
        roomId: CORRIDOR_IDS
      }

      expect(isCollisionBetweenRoomAndCorridor(event, corridorEvent)).toBe(true)
    })

    it('isCollisionBetweenRoomAndCorridor returns false if room and corridor do not collide', () => {
      const event2 = {
        id: 2,
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]]
      }

      expect(isCollisionBetweenRoomAndCorridor(event, event2)).toBe(false)
    })
  })

  describe('eventsUseSameRooms', () => {
    it('eventsUseSameRoom returns true if events use same room', () => {
      expect(eventsUseSameRooms(event, event)).toBe(true)
    })

    it('eventsUseSameRoom returns false if events do not use same room', () => {
      const event2 = {
        id: 2,
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]]
      }

      expect(eventsUseSameRooms(event, event2)).toBe(false)
    })
  })

  describe('findCollidingEvents', () => {
    it('returns empty set if no events collide', () => {
      const items = createItemsObject(event)
      const event2 = {
        ...event,
        id: 2,
        locationId: LOCATION_ID,
        roomId: [CORRIDOR_IDS[1]],
        trailer: 0
      }
      const collidingEvents = findCollisionBetweenEvents(event, event2, items)

      expect(collidingEvents).toEqual(new Set())
    })

    it('returns a set of colliding events when events collide in terms of time and location', () => {
      const event2 = {
        ...event,
        id: 2,
        trailer: 0,
        startDate: new Date('2021-05-01 13:40'),
        endDate: new Date('2021-05-01 15:00')
      }
      const items = createItemsObject(event)
      const collidingEvents = findCollisionBetweenEvents(event, event2, items)

      expect(collidingEvents).toEqual(new Set([event, event2]))
    })

    it('returns a set of colliding events when events collide in terms of time and items', () => {
      const event2 = {
        ...event,
        id: 2
      }
      const items = createItemsObject(event)
      increaseItemsUse(items, event2)
      const collidingEvents = findCollisionBetweenEvents(event, event2, items)

      expect(collidingEvents).toEqual(new Set([event, event2]))
    })
  })
})
