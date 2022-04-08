import { useState, useEffect } from 'react'
import { analytics, auth, firestore } from '../firebase/config'
import useAuthContext from './useAuthContext'

const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(undefined)
    setIsPending(true)
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)

      const dataRes = []
      const ref = firestore.collection('userDetails')
      const data = await ref.where('userId', '==', res.user.uid).get()
      data.docs.forEach((doc) => dataRes.push(doc.data()))
      if (dataRes.length > 0) {
        dispatch({
          type: 'LOGIN',
          payload: {
            uid: res.user.uid,
            displayName: res.user.displayName,
            email: res.user.email,
            emailVerified: res.user.emailVerified,
            committeeId: dataRes[0].committeeId
          }
        })
        analytics.logEvent(`User ${res.user.uid} logged in`)
      } else {
        throw Error('The user does not have a committee assigned')
      }

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

  return { login, isPending, error }
}

export default useLogin
