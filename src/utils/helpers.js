import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { db } from '../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { campuses, locations, rooms } from '../data/locationsData'
import CustomStore from 'devextreme/data/custom_store'
import { committees, committeesConsensus, kårer } from '../data/committees'

const moment = extendMoment(Moment)

export const sortAlphabetically = (elem) => {
  return elem.sort((a, b) => ('' + a.text).localeCompare(b.text, 'sv', { numeric: true }))
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
  return kårer[kår] || kårer.LinTek
}

export const defaultCampus = (committeeId) => {
  if (committeesConsensus.find((com) => com.id === committeeId)) return campuses[1]
  return campuses[0]
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
  load = undefined,
  remove = undefined,
  update = undefined
) => {
  return new CustomStore({
    key: 'id',
    ...(load ? load : {})
  })
}