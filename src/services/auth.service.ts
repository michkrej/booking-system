import {
  signInWithEmailAndPassword,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from './config'
import { getErrorMessage } from '@/utils/error.util'
import { User } from '@/utils/interfaces'

const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName: string,
  committeeId: string
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    const userDetailsDoc = {
      committeeId,
      email,
      userId: user.uid,
      admin: false,
      createdAt: new Date()
    }
    await updateProfile(user, { displayName })
    await addDoc(collection(db, 'userDetails'), userDetailsDoc)

    return {
      ...userDetailsDoc,
      displayName,
      emailVerified: user.emailVerified
    }
  } catch (error) {
    console.log(getErrorMessage(error))
    throw error
  }
}

const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const userDetailsSnapshot = await getDocs(
      query(collection(db, 'userDetails'), where('userId', '==', user.uid))
    )
    if (!userDetailsSnapshot.empty) {
      const userDetails = userDetailsSnapshot.docs[0].data()
      return {
        userId: user.uid,
        displayName: user.displayName ?? null,
        email: user.email ?? email,
        emailVerified: user.emailVerified,
        committeeId: userDetails.committeeId,
        admin: userDetails.admin ?? false
      } satisfies User
    } else {
      throw Error('The user does not have a committee assigned')
    }
  } catch (error) {
    console.log(getErrorMessage(error))
    throw error
  }
}

const signOut = async () => {
  try {
    await _signOut(auth)
  } catch (error) {
    console.log(getErrorMessage(error))
    throw error
  }
}

const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.log(getErrorMessage(error))
    throw error
  }
}

const updateUserDisplayName = async (newName: string) => {
  const user = auth.currentUser

  if (!user) {
    throw new Error('User not found')
  }

  try {
    updateProfile(user, {
      displayName: newName
    })
  } catch (error) {
    console.log(getErrorMessage(error))
  }
}

export const authService = {
  signUpWithEmailAndPassword,
  loginWithEmailAndPassword,
  updateUserDisplayName,
  resetPassword,
  signOut
}
