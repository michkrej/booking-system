import { adminService } from '@/services'
import { usePlanEditLock } from '@/state/store'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useAdminSettings = () => {
  const { changedPlanEditLock, planEditLocked } = usePlanEditLock()

  const lockPlans = (e: React.ChangeEvent<HTMLInputElement>) => {
    adminService
      .lockAndUnlockPlans(e.target.checked)
      .then(() => {
        const lockedOrUnlocked = e.target.checked
        changedPlanEditLock()
        if (lockedOrUnlocked) toast.success('Plan editing unlocked')
        else toast.success('Plan editing locked')
      })
      .catch(() => {
        toast.error('Failed to lock/unlock plans')
      })
  }

  useEffect(() => {
    const getAdminSettings = async () => {
      const { lockPlans } = await adminService.getAdminSettings()
      if (lockPlans !== planEditLocked) {
        changedPlanEditLock()
      }
    }

    getAdminSettings()
  }, [])

  return { planEditLocked, lockPlans }
}
