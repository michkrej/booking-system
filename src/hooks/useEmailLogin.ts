import { useEffect, useState } from 'react'
import { authService } from '../services/auth.service'
import { getErrorMessage } from '../utils/error.util'
import { useUser } from '../state/store'

export const useEmailLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUser()

  const login = async (email: string, password: string) => {
    setError(null)
    setIsPending(true)
    try {
      const user = await authService.loginWithEmailAndPassword(email, password)
      console.log(user)
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

  return { login, isPending, error }
}
