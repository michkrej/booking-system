import { useState, useEffect } from 'react'
import { useAppStore } from '../state/store'
import { authService } from '../services/auth.service'
import { getErrorMessage } from '../utils/error.util'

export const useSignOut = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateUser = useAppStore.use.updateUser()

  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {
      await authService.signOut()
      updateUser(null)

      if (!isCancelled) {
        setIsPending(false)
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

  return { logout, isPending, error }
}
