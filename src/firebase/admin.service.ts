import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from './config'
import { getErrorMessage } from '../utils/error.util'

const KEY = 'adminValues'

const lockAndUnlockPlans = async (newValue: boolean) => {
  try {
    const ref = await updateDoc(doc(db, 'adminSettings', KEY), {
      lockPlans: newValue
    })
    return ref
  } catch (e) {
    console.log(getErrorMessage(e))
  }
}

const getAdminSettings = async () => {
  const docSnap = await getDoc(doc(db, 'adminSettings', KEY))

  if (docSnap.exists()) {
    return docSnap.data() as { lockPlans: boolean }
  } else {
    console.log('No such document!')
    throw Error('No such document!')
  }
}

export const adminService = {
  lockAndUnlockPlans,
  getAdminSettings
}
