import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { corridorsC, roomsC } from '../data/campusValla/rooms/C'
import { locations } from '../data/locationsData'
const moment = extendMoment(Moment)

const LOCATION_ID = locations.campusValla['C-huset'].id
const CORRIDOR_IDS = Object.values(corridorsC).map((corridor) => corridor.id)
const MAX_ITEMS = {
  grillar: 9,
  bardiskar: 6,
  'bankset-hg': 20,
  'bankset-k': 24
}

const createItemsObject = (event) => {
  return Object.keys(MAX_ITEMS).reduce((items, item) => {
    items[item] = {
      sum: event[item] || 0,
      events: []
    }
    return items
  }, {})
}

const findCollidingEvents = (event1, event2, items) => {
  const collidingEvents = new Set()

  const increaseItemsUse = (items, event) => {
    Object.keys(items).forEach((item) => {
      if (event?.[item]) {
        items[item].sum += event[item]
        items[item].events.push(event)
      }
    })
  }

  const getEventsWithTooManyItems = (items) => {
    for (let item in items) {
      if (items[item].sum > MAX_ITEMS[item]) {
        return items[item].events
      }
    }
    return undefined
  }

  // Om användare har bokat salar i C-huset, då det går att boka enskilda salar eller hela korridorer
  const eventsInSameCorridor = (event1, event2) => {
    const isCollisionBetweenRoomAndCorridor = (event1, event2) => {
      if (event1.locationId !== LOCATION_ID || event2.locationId !== LOCATION_ID) {
        return false
      }

      const getBookedRooms = (event) => roomsC.filter((room) => event.roomId.includes(room.id))
      const getBookedCorridors = (event) => event.roomId.filter((id) => CORRIDOR_IDS.includes(id))

      const bookedRooms1 = getBookedRooms(event1)
      const bookedRooms2 = getBookedRooms(event2)
      const bookedCorridors1 = getBookedCorridors(event1)
      const bookedCorridors2 = getBookedCorridors(event2)

      return (
        bookedRooms1.some((room) => bookedCorridors2.includes(room.corridorId)) ||
        bookedRooms2.some((room) => bookedCorridors1.includes(room.corridorId))
      )
    }
    return event1.locationId === event2.locationId
      ? isCollisionBetweenRoomAndCorridor(event1, event2)
      : false
  }

  const eventsUseSameRooms = (event1, event2) =>
    event1.roomId.some((room) => event2.roomId.includes(room))

  if (event1.range.overlaps(event1.range)) {
    // check for item collisions
    increaseItemsUse(items, event2)
    const tooManyItems = getEventsWithTooManyItems(items)
    if (tooManyItems) {
      tooManyItems.forEach((itemEvent) => {
        collidingEvents.add(itemEvent)
      })
      collidingEvents.add(event1)
    }
    // check for room or corridor collisions
    if (eventsUseSameRooms(event1, event2) || eventsInSameCorridor(event1, event2)) {
      collidingEvents.add(event2)
      collidingEvents.add(event1)
    }
  }

  return collidingEvents
}

export const findCollisionsBetweenUserPlanAndPublicPlans = (events, userPlanId) => {
  let collidingEvents = new Set()
  const userPlan = []
  const publicPlans = []

  // Create arrays for personal and public events
  events.forEach((event) => {
    const newEvent = {
      ...event,
      range: moment.range(new Date(event.startDate), new Date(event.endDate))
    }
    if (event.planId === userPlanId) {
      userPlan.push(newEvent)
    } else {
      publicPlans.push(newEvent)
    }
  })

  // check for collisions between personal and public events
  userPlan.forEach((userEvent) => {
    const items = createItemsObject(userEvent)
    publicPlans.forEach((publicEvent) => {
      collidingEvents = new Set([
        ...collidingEvents,
        ...findCollidingEvents(userEvent, publicEvent, items)
      ])
    })
  })
  return [...collidingEvents]
}

export const findCollisionsBetweenAllEvents = (events) => {
  let collidingEvents = new Set()
  events.forEach((event1) => {
    const items = createItemsObject(event1)
    events.forEach((event2) => {
      if (event1.id !== event2.id && event1.planId !== event2.planId) {
        collidingEvents = new Set([
          ...collidingEvents,
          ...findCollidingEvents(event1, event2, items)
        ])
      }
    })
  })
  return []
}
