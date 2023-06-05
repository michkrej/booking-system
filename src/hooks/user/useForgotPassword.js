import { useState } from 'react'
import { auth } from '../../firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'

const useForgotPassword = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  const forgotPassword = async (email) => {
    setIsPending(true)
    setError(undefined)
    setSuccess(undefined)
    sendPasswordResetEmail(auth, email)
      .then(async () => {
        setIsPending(false)
        setSuccess('Ett mail har skickats till din e-postadress')
      })
      .catch((error) => {
        setError(error.message)
      })
    setIsPending(false)
  }

  return { forgotPassword, isPending, error, success }
}

export default useForgotPassword
