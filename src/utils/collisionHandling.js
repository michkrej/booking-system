import Moment from 'moment'
import { extendMoment } from 'moment-range'
import roomsC, { corridorsC } from '../data/campusValla/rooms/C'
import { locations } from '../data/locationsData'
const moment = extendMoment(Moment)

export const LOCATION_ID = locations.campusValla['C-huset'].id
export const CORRIDOR_IDS = Object.values(corridorsC).map((corridor) => corridor.id)
const MAX_ITEMS = {
  grillar: 8,
  bardiskar: 6,
  'bankset-hg': 20,
  'bankset-k': 25,
  trailer: 1,
  tents: 4,
  scene: 10,
  elverk: 1
}

/**
 * key: name of item
 * sum: the sum of that specific item
 * events: the event that uses that item
 */
export const createItemsObject = (event) => {
  const eventItemExists = (item) => event[item] !== undefined
  return Object.keys(MAX_ITEMS).reduce((items, item) => {
    items[item] = {
      sum: typeof event[item] === 'boolean' ? 1 : event[item] || 0,
      events: eventItemExists(item) ? [event] : []
    }
    return items
  }, {})
}

// Increases the sum of items and adds the event to the events array
export const increaseItemsUse = (items, event) => {
  Object.keys(items).forEach((item) => {
    if (event?.[item]) {
      if (typeof event[item] === 'boolean') {
        items[item].sum += 1
      } else {
        items[item].sum += event[item]
      }
      items[item].events.push(event)
    }
  })
}

// Iterates trough items and returns the first item that is over the limit
// TODO: return all items that are over the limit
export const getEventsWithTooManyItems = (items) => {
  for (let item in items) {
    if (items[item].sum > MAX_ITEMS[item]) {
      return items[item].events
    }
  }
  return undefined
}

export const isCollisionBetweenRoomAndCorridor = (event1, event2) => {
  if (event1.locationId !== LOCATION_ID || event2.locationId !== LOCATION_ID) {
    return false
  }

  const getBookedRooms = (event) => roomsC.filter((room) => event.roomId.includes(room.id))
  const getBookedCorridors = (event) => event.roomId.filter((id) => CORRIDOR_IDS.includes(id))

  return (
    getBookedRooms(event1).some((room) => getBookedCorridors(event2).includes(room.corridorId)) ||
    getBookedRooms(event2).some((room) => getBookedCorridors(event1).includes(room.corridorId))
  )
}

// Om användare har bokat salar i C-huset, då det går att boka enskilda salar eller hela korridorer
export const eventsInSameCorridor = (event1, event2) => {
  return event1.locationId === event2.locationId
    ? isCollisionBetweenRoomAndCorridor(event1, event2)
    : false
}

export const eventsUseSameRooms = (event1, event2) =>
  event1.roomId.some((room) => event2.roomId.includes(room))

export const findCollisionBetweenEvents = (event1, event2, items) => {
  const collidingEvents = new Set()

  const range1 = moment.range(moment(event1.startDate), moment(event1.endDate))
  const range2 = moment.range(moment(event2.startDate), moment(event2.endDate))
  if (range1.overlaps(range2)) {
    // check for item collisions
    increaseItemsUse(items, event2)
    const tooManyItems = getEventsWithTooManyItems(items)
    if (tooManyItems) {
      tooManyItems.forEach((itemEvent) => {
        collidingEvents.add(itemEvent)
      })
      // collidingEvents.add(event1) adding this is not necessary since the event should be in tooManyItems, I think
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
    if (event.planId === userPlanId) {
      userPlan.push(event)
    } else {
      publicPlans.push(event)
    }
  })

  // check for collisions between personal and public events
  userPlan.forEach((userEvent) => {
    const items = createItemsObject(userEvent)
    publicPlans.forEach((publicEvent) => {
      collidingEvents = new Set([
        ...collidingEvents,
        ...findCollisionBetweenEvents(userEvent, publicEvent, items)
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
          ...findCollisionBetweenEvents(event1, event2, items)
        ])
      }
    })
  })
  return [...collidingEvents]
}
