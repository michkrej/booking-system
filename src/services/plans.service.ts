import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

import { getErrorMessage } from '@/utils/error.util'
import { EditablePlanDetails, Plan, PlanEvent, User } from '@/utils/interfaces'
import { db } from './config'

interface CreatePlanParams extends Omit<Plan, 'createdAt' | 'updatedAt' | 'id'> {}
const createPlan = async (plan: CreatePlanParams) => {
  try {
    const newPlanDoc = {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const planRef = await addDoc(collection(db, 'plans'), newPlanDoc)
    return {
      id: planRef.id,
      ...newPlanDoc
    }
  } catch (e) {
    console.log(getErrorMessage(e))
    throw e
  }
}

export const deletePlan = async (planId: string) => {
  try {
    await deleteDoc(doc(db, 'plans', planId))
  } catch (e) {
    console.log(getErrorMessage(e))
  }
}

export const getAllPlans = async (user: User, year: number) => {
  try {
    const ref = collection(db, 'plans')
    const [snapshotPersonal, snapshotPublic] = await Promise.all([
      getDocs(query(ref, where('userId', '==', user.userId), where('year', '==', year))),
      getDocs(query(ref, where('public', '==', true), where('year', '==', year)))
    ])
    const userPlans = snapshotPersonal.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Plan[]
    const publicPlans = snapshotPublic.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Plan[]
    return {
      userPlans,
      publicPlans
    }
  } catch (e) {
    console.log(getErrorMessage(e))
    throw e
  }
}

export const getUserPlans = async (user: User, year: number) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'plans'), where('userId', '==', user.userId), where('year', '==', year))
    )
    const plans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Plan[]
    return plans
  } catch (e) {
    console.log(getErrorMessage(e))
    throw e
  }
}

const updatePlanDetails = async (id: string, newValues: Partial<EditablePlanDetails>) => {
  try {
    await updateDoc(doc(db, 'plans', id), {
      ...newValues,
      updatedAt: serverTimestamp()
    })
  } catch (e) {
    console.log(getErrorMessage(e))
  }
}

const addPlanEvent = async (planId: string, event: PlanEvent) => {
  try {
    const newEvent = {
      ...event,
      startDate: new Date(event.startDate).toString(),
      endDate: new Date(event.endDate).toString(),
      planId,
      id: uuidv4()
    }
    await updateDoc(doc(db, 'plans', planId), {
      events: arrayUnion(newEvent),
      updatedAt: new Date()
    })

    return event
  } catch (e) {
    console.log(getErrorMessage(e))
  }

  return null
}

const updatePlanEvent = async (plan: Plan, event: Partial<PlanEvent>) => {
  // find current event
  const planId = plan.id
  const currentEvent = plan.events.filter((e) => e.id === event.id)[0]

  const updatedEvent = {
    ...currentEvent,
    ...event,
    ...(event.startDate ? { startDate: new Date(event.startDate).toString() } : {}),
    ...(event.endDate ? { endDate: new Date(event.endDate).toString() } : {}),
    updatedAt: new Date()
  }

  // replace current event with updated event
  const newEvents = plan.events.map((e) => (e.id === event.id ? updatedEvent : e))

  try {
    await updateDoc(doc(db, 'plans', planId), {
      events: newEvents,
      updatedAt: serverTimestamp()
    })
    return updatedEvent
  } catch (e) {
    console.log(getErrorMessage(e))
  }
  return null
}

const deletePlanEvent = async (plan: Plan, eventId: string) => {
  try {
    const newEvents = plan.events.filter((event) => event.id !== eventId)
    await updateDoc(doc(db, 'plans', plan.id), {
      events: newEvents,
      updatedAt: serverTimestamp()
    })
  } catch (e) {
    console.log(getErrorMessage(e))
  }
}

export const plansService = {
  createPlan,
  deletePlan,
  getAllPlans,
  getUserPlans,
  updatePlanDetails,
  addPlanEvent,
  updatePlanEvent,
  deletePlanEvent
}
