import { useState, useEffect } from 'react'

import { authService } from '@/services'
import { usePlanActions, useUserUpdated } from '@/state/store'
import { getErrorMessage } from '@/utils/error.util'

export const useSignOut = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUserUpdated()
  const { userPlansLoaded, publicPlansLoaded } = usePlanActions()

  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {
      await authService.signOut()
      userUpdated(null)
      userPlansLoaded([])
      publicPlansLoaded([])

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
