import { useState } from 'react'
import { updateProfileName } from '../../firebase/dbActions'
import useAuthContext from '../context/useAuthContext'

const useChangeUsername = () => {
  const { user } = useAuthContext()
  const [username, setUsername] = useState(user.displayName)

  const changeUsername = () => {
    const name = window.prompt('Vad vill du att ditt namn ska vara?')
    if (name.length > 0) {
      updateProfileName(name)
      setUsername(name)
    }
  }

  return { username, changeUsername }
}

export default useChangeUsername
