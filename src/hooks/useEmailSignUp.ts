import { useState, useEffect } from 'react'

import { authService } from '@/services'
import { useUserUpdated } from '@/state/store'
import { getErrorMessage } from '@/utils/error.util'
import { toast } from 'sonner'

export const useEmailSignUp = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUserUpdated()

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    committeeId: string
  ) => {
    setError(null)
    setIsPending(true)
    setIsCancelled(false)
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
        setError(errorMessage)
        setIsPending(false)
        toast.error(errorMessage)
      }
    }
  }
  /*  useEffect(() => {
    return () => {
      console.log('cleanup')
      setIsCancelled(true)
    }
  }, []) */

  return { error, isPending, signup }
}
