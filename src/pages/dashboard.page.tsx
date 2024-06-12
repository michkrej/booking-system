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

export function DashboardPage() {
  const { user } = useUser()
  const planYear = usePlanYear()
  const { getPublicAndUserPlans } = useGetPlans()

  useEffect(() => {
    getPublicAndUserPlans(planYear)
  }, [planYear])

  const committee = useMemo(() => getCommittee(user.committeeId), [user.committeeId])

  const bgColor = committee?.color ? `bg-[${committee.color}]` : 'bg-primary'

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <CreateNewPlanCard />
            <Card>
              <CardHeader>
                <CardDescription>{user.displayName}</CardDescription>
                <CardTitle className="text-4xl">{committee?.text}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-end">
                <span>Färg: </span>
                <div className={`m-2 h-10 w-16 rounded border ${bgColor}`}></div>
              </CardContent>
            </Card>
            <PlanChangeYearCard />
            <UserPlansListCard />
            <Card>
              <CardHeader className="pb-10">
                <CardDescription>Veckor till mottagning</CardDescription>
                <CardTitle className="text-4xl">33</CardTitle>
              </CardHeader>
              <CardContent className="justify-end place-self-end justify-self-end">
                <Progress value={25} aria-label="25% increase" />
              </CardContent>
            </Card>
          </div>
        </div>
        <PublicPlansCard />
      </main>
      <SiteFooter />
    </div>
  )
}
