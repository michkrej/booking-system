import { useEffect, useState } from 'react'
import { getAdminSettings, lockAndUnlockPlans } from '../firebase/dbActions'

const useAdminSettings = () => {
  const [checked, setChecked] = useState(false)

  const getCheckboxValue = async () => {
    const { lockPlans } = await getAdminSettings(false)
    setChecked(lockPlans)
  }

  const lockPlans = (e) => {
    lockAndUnlockPlans(e.target.checked)
    setChecked((prev) => !prev)
  }

  useEffect(() => {
    getCheckboxValue()
  }, [])

  return { checked, lockPlans }
}

export default useAdminSettings
