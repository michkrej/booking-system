import { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import { collection, where, getDocs, query } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import useAuthContext from './useAuthContext'

const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const { dispatch } = useAuthContext()

  const login = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')
    const password = data.get('password')

    setError(undefined)
    setIsPending(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      const userDetailsSnapshot = await getDocs(
        query(collection(db, 'userDetails'), where('userId', '==', user.uid))
      )
      if (!userDetailsSnapshot.empty) {
        const userDetails = userDetailsSnapshot.docs[0].data()
        dispatch({
          type: 'LOGIN',
          payload: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            committeeId: userDetails.committeeId,
            admin: userDetails.admin
          }
        })
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
