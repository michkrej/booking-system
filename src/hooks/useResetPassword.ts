import { useState } from 'react'
import { authService } from '../firebase/auth.service'

export const useResetPassword = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>()
  const [success, setSuccess] = useState<string | null>()

  const resetPassword = async (email: string) => {
    setIsPending(true)
    setError(undefined)
    setSuccess(undefined)

    authService
      .resetPassword(email)
      .then(async () => {
        setIsPending(false)
        setSuccess('Ett mail har skickats till din e-postadress')
      })
      .catch((error) => {
        setError(error.message)
      })
    setIsPending(false)
  }

  return { resetPassword, isPending, error, success }
}
