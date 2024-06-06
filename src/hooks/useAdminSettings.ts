import { useEffect } from 'react'
import { adminService } from '../firebase/admin.service'
import { useAppStore } from '../state/store'

export const useAdminSettings = () => {
  const updatePlanLock = useAppStore.use.updatePlanLock()
  const planEditLocked = useAppStore.use.planEditLocked()

  const lockPlans = (e: React.ChangeEvent<HTMLInputElement>) => {
    adminService.lockAndUnlockPlans(e.target.checked)
    updatePlanLock(e.target.checked)
  }

  useEffect(() => {
    const getAdminSettings = async () => {
      const { lockPlans } = await adminService.getAdminSettings()
      updatePlanLock(lockPlans)
    }

    getAdminSettings()
  }, [])

  return { planEditLocked, lockPlans }
}
