import { authService } from '@/services'
import { useUser, useUserUpdated } from '@/state/store'

export const useUpdateDisplayName = () => {
  const { user } = useUser()
  const { userUpdated } = useUserUpdated()

  const updateDisplayName = () => {
    const newName = window.prompt('Vad vill du att ditt namn ska vara?')
    if (newName) {
      authService.updateUserDisplayName(newName)
      userUpdated({ ...user, displayName: newName })
    }
  }

  return { updateDisplayName }
}
