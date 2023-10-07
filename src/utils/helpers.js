import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { db } from '../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { campuses, locationsNonGrouped, rooms } from '../data/locationsData'
import CustomStore from 'devextreme/data/custom_store'
import { committees, committeesConsensus, kårer } from '../data/committees'
import { deleteEvent, insertEvent, loadEvents, updateEvent } from '../firebase/dbActions'

const moment = extendMoment(Moment)

export const sortAlphabetically = (elem, useLabel = false) => {
  return elem.sort((a, b) =>
    ('' + (useLabel ? a.label : a.text)).localeCompare(useLabel ? b.label : b.text, 'sv', {
      numeric: true
    })
  )
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
  const events = await getContentById(
    plans.length === 1 ? [plans[0].id] : plans.map((plan) => plan.id),
    'events',
    'planId'
  )
  events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const cvsConversion = events.map((event) => {
    const committee = committees.find((com) => com.id === event.committeeId)
    const location = locationsNonGrouped.find((location) => location.id === event.locationId)
    const roomNames = event.roomId
      .map((eventRoomID) => rooms.find((room) => room.id === eventRoomID).text)
      .join(', ')
    return [
      event.id,
      committee.text,
      event.text,
      location.text,
      roomNames,
      moment(event.startDate).format('YY-MM-DD'),
      moment(event.startDate).format('HH:mm'),
      moment(event.endDate).format('YY-MM-DD'),
      moment(event.endDate).format('HH:mm'),
      event.alcohol ? 'TRUE' : 'FALSE',
      event.food ? 'TRUE' : 'FALSE',
      event.bardiskar || '0',
      event['bankset-k'] || '0',
      event['bankset-hg'] || '0',
      event.grillar || '0',
      event.annat || '',
      event.description || '',
      event.link || ''
    ]
  })
  return [header, ...cvsConversion]
}

export const kårCommittees = (kår) => {
  return kårer[kår] || kårer.LinTek
}

export const defaultCampus = (committeeId) => {
  if (committeesConsensus.find((com) => com.id === committeeId)) return campuses[1]
  return campuses[0]
}

export const formatCollisions = (collisions) => {
  return `+${(collisions || []).map((collision) => collision.id).join('+')}`
}

export async function getContentById(ids, path, id) {
  // don't run if there aren't any ids or a path for the collection
  if (!ids || !ids.length || !path) return []

  const collectionPath = collection(db, path)
  const batches = []

  while (ids.length) {
    // firestore limits batches to 10
    const batch = ids.splice(0, 10)

    // add the batch request to to a queue
    batches.push(
      getDocs(query(collectionPath, where(id, 'in', [...batch]))).then((results) =>
        results.docs.map((result) => ({ id: result.id, ...result.data() }))
      )
    )
  }

  // after all of the data is fetched, return it
  return Promise.all(batches).then((content) => content.flat())
}

export const createCustomDataSource = (
  user,
  { load = true, insert = false, remove = false, update = false },
  collisionFunction = undefined
) => {
  const urlIndex =
    window.location.pathname.includes('all') && !window.location.pathname.includes('allEvents')
      ? 3
      : 2
  return new CustomStore({
    key: 'id',
    ...(load
      ? {
          load: async () => {
            return await loadEvents(
              window.location.pathname.split('/')[urlIndex],
              collisionFunction
            )
          }
        }
      : {}),
    ...(insert
      ? {
          insert: async (values) => {
            return await insertEvent(values, user)
          }
        }
      : {}),
    ...(remove
      ? {
          remove: async (id) => {
            await deleteEvent(id)
          }
        }
      : {}),
    ...(update
      ? {
          update: async (id, values) => {
            return await updateEvent(id, values)
          }
        }
      : {})
  })
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export const getYears = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2022 + 1 }, (_, i) => i + 2022)
  // Conditionally extend years with one year if the date is past october 1st
  if (new Date().getMonth() >= 9) {
    years.push(currentYear + 1)
  }
  return years
}

export const getActiveYear = () => {
  // The year should be the current year if the date is past october 1st
  const currentYear = new Date().getFullYear()
  if (new Date().getMonth() >= 9) {
    return currentYear + 1
  }
  return currentYear
}
