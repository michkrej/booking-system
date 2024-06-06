import { useState, useEffect } from 'react'
import { authService } from '../services/auth.service'
import { useUser } from '../state/store'
import { getErrorMessage } from '../utils/error.util'

export const useEmailSignUp = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUser()

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    committeeId: string
  ) => {
    setError(null)
    setIsPending(true)
    try {
      const user = await authService.signUpWithEmailAndPassword(
        email,
        password,
        displayName,
        committeeId
      )
      userUpdated(user)

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (error) {
      if (!isCancelled) {
        const errorMessage = getErrorMessage(error)
        console.log(errorMessage)
        setError(errorMessage)
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
