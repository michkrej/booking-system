import { authService } from '@/services'
import { useUser } from '@/state/store'
import { getErrorMessage } from '@/utils/error.util'
import { useState, useEffect } from 'react'

export const useSignOut = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUser()

  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {
      await authService.signOut()
      userUpdated(null)

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
