import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
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
    const ref = await setDoc(doc(collection(db, 'adminSettings'), key), {
      lockPlans: newValue
    })
    return ref
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
