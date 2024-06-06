import { authService } from '@/services'
import { useUser } from '@/state/store'

export const useUpdateDisplayName = () => {
  const { user, userUpdated } = useUser()

  const updateDisplayName = () => {
    const newName = window.prompt('Vad vill du att ditt namn ska vara?')
    if (newName) {
      authService.updateUserDisplayName(newName)
      userUpdated({ ...user, displayName: newName })
    }
  }

  return { updateDisplayName }
}
