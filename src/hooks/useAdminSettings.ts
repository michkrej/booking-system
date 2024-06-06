import { useEffect } from 'react'
import { adminService } from '../services/admin.service'
import { usePlanEditLock } from '../state/store'

export const useAdminSettings = () => {
  const { changedPlanEditLock, planEditLocked } = usePlanEditLock()

  const lockPlans = (e: React.ChangeEvent<HTMLInputElement>) => {
    adminService.lockAndUnlockPlans(e.target.checked)
    changedPlanEditLock(e.target.checked)
  }

  useEffect(() => {
    const getAdminSettings = async () => {
      const { lockPlans } = await adminService.getAdminSettings()
      changedPlanEditLock(lockPlans)
    }

    getAdminSettings()
  }, [])

  return { planEditLocked, lockPlans }
}
