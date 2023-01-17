import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { getContentById } from '../utils/helpers'
import { db } from './config'

export const loadEvents = async (planIds, collisionFunction = undefined) => {
  const res = await getContentById(planIds.split('+'), 'events', 'planId')
  if (res.length < 1) {
    console.log('No events to load')
    return []
  } else {
    return collisionFunction ? collisionFunction(res, planIds.split('+')[0]) : res
  }
}

export const insertEvent = async (values, user) => {
  const doc = {
    ...values,
    startDate: new Date(values.startDate).toString(),
    endDate: new Date(values.endDate).toString(),
    planId: window.location.pathname.split('/')[2],
    committeeId: user.committeeId
  }
  try {
    await addDoc(collection(db, 'events'), doc)
  } catch (e) {
    console.log(e.message)
  }
  return values
}

export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, 'events', id))
  } catch (e) {
    console.log(e.message)
  }
}

export const updateEvent = async (id, values) => {
  try {
    const docRef = doc(db, 'events', id)
    await updateDoc(doc(db, 'events', id), {
      ...values
    })
    return docRef
  } catch (e) {
    console.log(e.message)
  }
}
