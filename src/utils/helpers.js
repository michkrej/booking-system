import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { firestore } from '../firebase/config'
import { corridorsC, locationsValla, roomsC } from './campusValla'
import { committees, committeesConsensus, kårer } from './committees'
import { campuses, locations, rooms } from './data'

const moment = extendMoment(Moment)

export const sortAlphabetically = (elem) => {
  return elem.sort((a, b) => ('' + a.text).localeCompare(b.text, 'sv', { numeric: true }))
}

const LOCATION_ID = locations['C-huset'].id
const CORRIDOR_IDS = Object.values(corridorsC).map((corridor) => corridor.id)

const getBookedRooms = (event) => roomsC.filter((room) => event.roomId.includes(room.id))
const getBookedCorridors = (event) => event.roomId.filter((id) => CORRIDOR_IDS.includes(id))

const isCollisionBetweenRoomAndCorridor = (event1, event2) => {
  if (event1.locationId !== LOCATION_ID || event2.locationId !== LOCATION_ID) {
    return false
  }

  const bookedRooms1 = getBookedRooms(event1)
  const bookedRooms2 = getBookedRooms(event2)
  const bookedCorridors1 = getBookedCorridors(event1)
  const bookedCorridors2 = getBookedCorridors(event2)

  return (
    bookedRooms1.some((room) => bookedCorridors2.includes(room.corridorId)) ||
    bookedRooms2.some((room) => bookedCorridors1.includes(room.corridorId))
  )
}

const increaseItemsUse = (items, event) => {
  const itemKeys = Object.keys(items)
  itemKeys.forEach((key) => {
    if (event?.[key]) {
      items[key].sum += event[key]
      items[key].events.push(event)
    }
  })

  return items
}

const addItems = (items) => {
  const maxBankset = 25
  const maxGrillar = 9
  const maxBardiskar = 6
  if (items.grillar.sum > maxGrillar) return items.grillar.events
  if (items.bardiskar.sum > maxBardiskar) return items.bardiskar.events
  if (items.banksetHG.sum > maxBankset) return items.banksetHG.events
  if (items.banksetK.sum > maxBankset) return items.banksetK.events

  return undefined
}

export const findCollisions = (events, personalPlanId) => {
  const result = []
  const personalPlan = events.filter((event) => event.planId === personalPlanId)
  const publicPlans = events.filter((event) => event.planId !== personalPlanId)
  personalPlan.forEach((ev1) => {
    let items = {
      grillar: {
        sum: ev1?.grillar ?? 0,
        events: []
      },
      bardiskar: {
        sum: ev1?.bardiskar ?? 0,
        events: []
      },
      banksetK: {
        sum: ev1?.['bankset-k'] ?? 0,
        events: []
      },
      banksetHG: {
        sum: ev1?.['bankset-hg'] ?? 0,
        events: []
      }
    }
    publicPlans.forEach((ev2) => {
      // Hantera krockar i C-huset
      const hasSameCorridor =
        ev1.locationId === ev2.locationId ? isCollisionBetweenRoomAndCorridor(ev1, ev2) : false

      const firstEvent = moment.range(new Date(ev1.startDate), new Date(ev1.endDate))
      const firstRooms = ev1.roomId
      const secondEvent = moment.range(new Date(ev2.startDate), new Date(ev2.endDate))
      const secondRooms = ev2.roomId
      const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
      if (firstEvent.overlaps(secondEvent)) {
        items = increaseItemsUse(items, ev2)
        const tooManyItems = addItems(items)
        if (tooManyItems) {
          tooManyItems.forEach((item) => {
            if (!result.includes(item)) {
              result.push(item)
            }
          })
          if (!result.includes(ev1)) {
            result.push(ev1)
          }
        }
        if (clashingRooms || hasSameCorridor) {
          if (!result.includes(ev2)) {
            result.push(ev2)
          }
          if (!result.includes(ev1)) {
            result.push(ev1)
          }
        }
      }
    })
  })
  return result
}

export const findAllCollisions = (events, personalPlanId) => {
  const result = []
  events.forEach((ev1) => {
    let items = {
      grillar: {
        sum: ev1?.grillar ?? 0,
        events: []
      },
      bardiskar: {
        sum: ev1?.bardiskar ?? 0,
        events: []
      },
      banksetK: {
        sum: ev1?.['bankset-k'] ?? 0,
        events: []
      },
      banksetHG: {
        sum: ev1?.['bankset-hg'] ?? 0,
        events: []
      }
    }
    events.forEach((ev2) => {
      // Hantera krockar i C-huset
      if (ev1.id !== ev2.id && ev1.planId !== ev2.planId) {
        // if we arn't looking at the same element
        const hasSameCorridor =
          ev1.locationId === ev2.locationId ? isCollisionBetweenRoomAndCorridor(ev1, ev2) : false

        const firstEvent = moment.range(new Date(ev1.startDate), new Date(ev1.endDate))
        const firstRooms = ev1.roomId
        const secondEvent = moment.range(new Date(ev2.startDate), new Date(ev2.endDate))
        const secondRooms = ev2.roomId
        const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
        if (firstEvent.overlaps(secondEvent)) {
          items = increaseItemsUse(items, ev2)
          const tooManyItems = addItems(items)
          if (tooManyItems) {
            tooManyItems.forEach((item) => {
              if (!result.includes(item)) {
                result.push(item)
              }
            })
            if (!result.includes(ev1)) {
              result.push(ev1)
            }
          }
          if (clashingRooms || hasSameCorridor) {
            if (!result.includes(ev2)) {
              result.push(ev2)
            }
            if (!result.includes(ev1)) {
              result.push(ev1)
            }
          }
        }
      }
    })
  })
  return result
}

export const exportPlan = async (plans) => {
  const header = [
    'ID',
    'Fadderi',
    'Aktivitet',
    'Område',
    'Plats',
    'Startdatum',
    'Starttid',
    'Slutdatum',
    'Sluttid',
    'Alkohol',
    'Mat',
    'Bardiskar',
    'Bänkset Kårallen',
    'Bänkset HG',
    'Grillar',
    'Annat bokbart',
    'Beskrivining',
    'Länk'
  ]
  const res = await getContentById(
    plans.length === 1 ? [plans[0].value] : plans.map((plan) => plan.value),
    'events',
    'planId'
  )
  const cvsConversion = res.map((elem) => {
    const committee = committees.find((com) => com.id === elem.committeeId)
    const location = Object.values(locations).find((location) => location.id === elem.locationId)
    const _rooms = elem.roomId.map((room) => rooms.find((r) => r.id === room)?.text)
    return [
      elem.id,
      committee.text,
      elem.text,
      location.text,
      _rooms,
      moment(elem.startDate).format('YY-MM-DD'),
      moment(elem.startDate).format('HH:mm').toString(),
      moment(elem.endDate).format('YY-MM-DD'),
      moment(elem.endDate).format('HH:mm').toString(),
      elem.alcohol ? 'TRUE' : 'FALSE',
      elem.food ? 'TRUE' : 'FALSE',
      elem.bardiskar ?? '0',
      elem['bankset-k'] ?? '0',
      elem['bankset-hg'] ?? '0',
      elem.grillar ?? '0',
      elem.annat ?? '',
      elem.description ?? '',
      elem.link ?? ''
    ]
  })
  return [header, ...cvsConversion]
}

export const kårCommittees = (kår) => {
  switch (kår) {
    case 'LinTek':
      return kårer.LinTek
    case 'StuFF':
      return kårer.StuFF
    case 'Consensus':
      return kårer.Consensus
    default:
      return kårer.LinTek
  }
}

export const defaultCampus = (committeeId) => {
  if (committeesConsensus.find((com) => com.id === committeeId)) return campuses[1]
  return campuses[0]
}

export async function getContentById(ids, path, id) {
  // don't run if there aren't any ids or a path for the collection
  if (!ids || !ids.length || !path) return []

  const collectionPath = firestore.collection(path)
  const batches = []

  while (ids.length) {
    // firestore limits batches to 10
    const batch = ids.splice(0, 10)

    // add the batch request to to a queue
    batches.push(
      collectionPath
        .where(id, 'in', [...batch])
        .get()
        .then((results) => results.docs.map((result) => ({ id: result.id, ...result.data() })))
    )
  }

  // after all of the data is fetched, return it
  return Promise.all(batches).then((content) => content.flat())
}
