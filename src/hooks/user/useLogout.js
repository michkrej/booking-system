import { useState, useEffect } from 'react'
import { auth } from '../../firebase/config'
import { signOut } from 'firebase/auth'
import useAuthContext from '../context/useAuthContext'

const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const { dispatch } = useAuthContext()

  const logout = async () => {
    setError(undefined)
    setIsPending(true)
    try {
      await signOut(auth)
      dispatch({ type: 'LOGOUT' })

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

  return { logout, isPending, error }
}

export default useLogout
