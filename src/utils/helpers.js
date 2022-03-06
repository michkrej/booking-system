import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { corridorsC, locations, roomsC } from './data'

const moment = extendMoment(Moment)

export const sortAlphabetically = (elem) =>
  elem.sort((a, b) => ('' + a.text).localeCompare(b.text, 'sv', { numeric: true }))

const corridorIds = Object.values(corridorsC).map((corridor) => corridor.id)

const collisionCorridorAndRoom = (ev1, ev2) => {
  if (ev1.locationId === locations['C-huset'].id) {
    // hitta korridorerna
    const bookedRooms1 = roomsC.filter((room) => ev1.roomId.includes(room.id))
    const bookedRooms2 = roomsC.filter((room) => ev2.roomId.includes(room.id))
    const bookedCorridors1 = ev1.roomId.filter((id) => corridorIds.includes(id))
    const bookedCorridors2 = ev2.roomId.filter((id) => corridorIds.includes(id))

    if (
      bookedRooms1.some((room) => bookedCorridors2.includes(room.corridorId)) ||
      bookedRooms2.some((room) => bookedCorridors1.includes(room.corridorId))
    ) {
      return true
    }
  }
  return false
}

const collisionsItems = (ev1, ev2) => {
  const maxBankset = 25
  const maxGrillar = 9
  const maxBardiskar = 6

  const ev1Grillar = ev1?.grillar ?? 0
  const ev1Bankset = ev1?.bankset ?? 0
  const ev1Bardiskar = ev1?.bardiskar ?? 0
  const ev2Grillar = ev2?.grillar ?? 0
  const ev2Bankset = ev2?.bankset ?? 0
  const ev2Bardiskar = ev2?.bardiskar ?? 0
  if (ev1Bankset + ev2Bankset > maxBankset) return true
  if (ev1Grillar + ev2Grillar > maxGrillar) return true
  if (ev1Bardiskar + ev2Bardiskar > maxBardiskar) return true
  return false
}

export const findCollisions = (events, personalPlanId) => {
  const result = []
  const personalPlan = events.filter((event) => event.planId === personalPlanId)
  const publicPlans = events.filter((event) => event.planId !== personalPlanId)
  personalPlan.forEach((ev1) => {
    publicPlans.forEach((ev2) => {
      // Skit i att göra saker om de eventen inte sker inom samma område
      if (ev1.locationId === ev2.locationId) {
        // Hantera krockar i C-huset
        const hasSameCorridor = collisionCorridorAndRoom(ev1, ev2)
        const usesSameEquipment = collisionsItems(ev1, ev2)

        const firstEvent = moment.range(new Date(ev1.startDate), new Date(ev1.endDate))
        const firstRooms = ev1.roomId
        const secondEvent = moment.range(new Date(ev2.startDate), new Date(ev2.endDate))
        const secondRooms = ev2.roomId
        const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
        if (
          firstEvent.overlaps(secondEvent) &&
          (clashingRooms || hasSameCorridor || usesSameEquipment)
        ) {
          result.push(ev2)
          if (!result.includes(ev1)) {
            result.push(ev1)
          }
        }
      }
    })
  })
  return result
}
