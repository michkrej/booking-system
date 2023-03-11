import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { getContentById } from '../utils/helpers'
import { auth, db } from './config'

export const updateProfileName = async (newName) => {
  try {
    updateProfile(auth.currentUser, {
      displayName: newName
    })
  } catch (error) {
    console.log(error.message)
  }
}

const key = 'adminValues'
export const lockAndUnlockPlans = async (newValue) => {
  try {
    const planRef = await setDoc(doc(collection(db, 'adminSettings'), key), { lockPlans: newValue })
    return planRef
  } catch (e) {
    console.log(e.message)
  }
}

export const getAdminSettings = async () => {
  const docRef = doc(db, 'adminSettings', key)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!')
  }
}

// Plan actions
export const createPlan = async (plan) => {
  try {
    const planRef = await addDoc(collection(db, 'plans'), {
      ...plan,
      createdAt: Timestamp.fromDate(new Date())
    })
    return planRef
  } catch (e) {
    console.log(e.message)
  }
}

export const deletePlan = async (id) => {
  try {
    await deleteDoc(doc(db, 'plans', id))

    const batch = writeBatch(db)
    const eventsSnapshot = await getDocs(query(collection(db, 'events'), where('planId', '==', id)))
    eventsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    batch.commit()
  } catch (e) {
    console.log(e.message)
  }
}

export const updatePlan = async (id, newValues) => {
  try {
    return await updateDoc(doc(db, 'plans', id), {
      ...newValues,
      updatedAt: Timestamp.fromDate(new Date())
    })
  } catch (e) {
    console.log(e.message)
  }
}

export const getAllPlans = async ({ uid }) => {
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

// Event actions
/**
 * TODO
 * If reading like this gets too expensive: connect to an array
 * instead and then parse and save array to Firebase on button click
 */
export const loadEvents = async (planIds, collisionFunction = undefined) => {
  const res = await getContentById(planIds.split('+'), 'events', 'planId') // TODO, do this with writeBatch instead
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
    committeeId: user.committeeId,
    userId: user.uid,
    createdAt: Timestamp.fromDate(new Date())
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
      ...values,
      updatedAt: Timestamp.fromDate(new Date())
    })
    return docRef
  } catch (e) {
    console.log(e.message)
  }
}
