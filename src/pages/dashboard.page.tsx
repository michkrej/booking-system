import { useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/molecules/header'
import { PublicPlansCard } from '@/components/organisms/publicPlansCard'
import { SiteFooter } from '@/components/molecules/siteFooter'
import { useGetPlans } from '@/hooks'
import { CreateNewPlanCard } from '@/components/organisms/createNewPlanCard'
import { UserPlansListCard } from '@/components/organisms/userPlansListCard'
import { usePlanYear, useUser } from '@/state'
import { PlanChangeYearCard } from '@/components/organisms/planChangeYearCard'
import { getCommittee } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Kår } from '@/utils/interfaces'
import { kårCommittees } from '@/utils/helpers'
import { FindCollisionsCard } from '@/components/organisms/findCollisionsCard'

const NOLLE_P_START = new Date('2024-08-20')
const PREV_NOLLE_P_END = new Date('2023-8-31')

const getWeeksLeftToNolleP = () => {
  const now = new Date()
  const diff = NOLLE_P_START.getTime() - now.getTime()
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7))
  return weeks
}

const getTotalWeeksToNolleP = () => {
  const diff = NOLLE_P_START.getTime() - PREV_NOLLE_P_END.getTime()
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7))
  return weeks
}

const getPercentageProgress = () => {
  const weeksToNolleP = getWeeksLeftToNolleP()
  const totalWeeksToNolleP = getTotalWeeksToNolleP()
  const progress = Math.round(((totalWeeksToNolleP - weeksToNolleP) / totalWeeksToNolleP) * 100)
  return progress
}

export function DashboardPage() {
  const { user } = useUser()
  const planYear = usePlanYear()
  const { getUserPlans, getPublicPlans, getPublicAndUserPlans } = useGetPlans()

  useEffect(() => {
    getPublicAndUserPlans(planYear)
  }, [planYear])

  const committee = useMemo(() => getCommittee(user.committeeId), [user.committeeId])
  const bgColor = committee?.color ? `bg-[${committee.color}]` : 'bg-primary'

  const weeksToNolleP = getWeeksLeftToNolleP()
  const progress = getPercentageProgress()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <CreateNewPlanCard />
            {/*           <Card>
              <CardHeader>
                <CardDescription>{user.displayName}</CardDescription>
                <CardTitle className="text-4xl">{committee?.text}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-end">
                <span>Färg: </span>
                <div className={`m-2 h-10 w-16 rounded border ${bgColor}`}></div>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="pb-10">
                <CardDescription>Veckor till mottagning</CardDescription>
                <CardTitle className="text-4xl">{weeksToNolleP}</CardTitle>
              </CardHeader>
              <CardContent className="justify-end place-self-end justify-self-end">
                <Progress value={progress} aria-label="25% increase" />
              </CardContent>
            </Card>
            <PlanChangeYearCard />
            <UserPlansListCard />
            <FindCollisionsCard />
          </div>
        </div>
        <PublicPlansCard />
      </main>
      <SiteFooter />
    </div>
  )
}
