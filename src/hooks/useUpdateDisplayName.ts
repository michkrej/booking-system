import { useUpdateUser, useUser } from '../state/store'
import { authService } from '../firebase/auth.service'

export const useUpdateDisplayName = () => {
  const user = useUser()
  const updateUser = useUpdateUser()

  const updateDisplayName = () => {
    const newName = window.prompt('Vad vill du att ditt namn ska vara?')
    if (newName) {
      authService.updateUserDisplayName(newName)
      updateUser({ ...user, displayName: newName })
    }
  }

  return { updateDisplayName }
}
