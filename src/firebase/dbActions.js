import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { getContentById } from '../utils/helpers'
import { db } from './config'

// Plan actions
export const createPlan = async (plan) => {
  try {
    const planRef = await addDoc(collection(db, 'plans'), plan)
    return planRef
  } catch (e) {
    console.log(e.message)
  }
}

export const deletePlan = async (id) => {
  try {
    await deleteDoc(doc(db, 'plans', id))
  } catch (e) {
    console.log(e.message)
  }
}

export const updatePlan = async (id, newValues) => {
  try {
    return await updateDoc(doc(db, 'plans', id), { ...newValues })
  } catch (e) {
    console.log(e.message)
  }
}

export const getUserAndPublicPlans = async ({ uid }) => {
  try {
    const ref = collection(db, 'plans')
    const [snapshotPersonal, snapshotPublic] = await Promise.all([
      getDocs(query(ref, where('userId', '==', uid))),
      getDocs(query(ref, where('public', '==', true)))
    ])
    const plans = snapshotPersonal.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    const publicPlans = snapshotPublic.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return {
      plans,
      publicPlans
    }
  } catch (e) {
    console.log(e.message)
  }
}

export const getAllPlans = () => {
  return getDocs(collection(db, 'plans')).then((results) =>
    results.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  )
}

// Event actions
/**
 * TODO
 * If reading like this gets too expensive: connect to an array
 * instead and then parse and save array to Firebase on button click
 */
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