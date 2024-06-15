import { authService } from '@/services'
import { useUserUpdated } from '@/state/store'
import { getErrorMessage } from '@/utils/error.util'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useEmailLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userUpdated } = useUserUpdated()

  const login = async (email: string, password: string) => {
    setError(null)
    setIsPending(true)
    try {
      const user = await authService.loginWithEmailAndPassword(email, password)
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
        toast.error(errorMessage)
      }
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    return () => {
      setIsCancelled(true)
    }
  }, [])

  return { login, isPending }
}
