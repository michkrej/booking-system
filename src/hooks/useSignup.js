import { useState, useEffect } from 'react'
import { analytics, auth, firestore } from '../firebase/config'
import useAuthContext from './useAuthContext'

const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, committee) => {
    setError(undefined)
    setIsPending(true)
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not create user')
      }

      await res.user.updateProfile({ displayName })
      await firestore.collection('userDetails').add({
        committeeId: committee,
        userId: res.user.uid
      })

      dispatch({
        type: 'LOGIN',
        payload: {
          uid: res.user.uid,
          displayName: res.user.displayName,
          email: res.user.email,
          emailVerified: res.user.emailVerified,
          committeeId: committee
        }
      })
      analytics.logEvent(`User ${res.user.uid} created`)
      if (!isCancelled) {
        setIsPending(false)
        setError(undefined)
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message)
        setError(error.message)
        setIsPending(false)
      }
    }
  }
  useEffect(() => {
    return () => {
      setIsCancelled(true)
    }
  }, [])

  return { error, isPending, signup }
}

export default useSignup
