import { adminService } from '@/services'
import { usePlanEditLock } from '@/state/store'
import { useEffect } from 'react'

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
