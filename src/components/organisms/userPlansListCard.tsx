import { Globe, GlobeLock } from 'lucide-react'

import { useEditPlan, useGetPlans } from '@/hooks'
import { formatDate } from '@/lib/utils'
import { useUserPlans } from '@/state'
import { PlanChangeNameButton } from '../molecules/planChangeNameButton'
import { PlanDeleteButton } from '../molecules/planDeleteButton'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { PlanTogglePublicButton } from '../molecules/planTogglePublicButton'

const loadingTableEntries = Array.from({ length: 4 }, (_, i) => i)

export const UserPlansListCard = () => {
  const userPlans = useUserPlans()
  const { togglePublicPlan } = useEditPlan()
  const { isPending } = useGetPlans()

  return (
    <Card className="sm:col-span-4">
      <CardHeader className="pb-3">
        <CardTitle>Dina planeringar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Skapad</TableHead>
              <TableHead>Uppdaterad</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isPending
              ? userPlans.map((plan) => {
                  const createdAt = formatDate(plan.createdAt)
                  const updatedAt = formatDate(plan.updatedAt)
                  return (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.label}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell>{updatedAt}</TableCell>
                      <TableCell className="flex items-center justify-end gap-4">
                        <PlanDeleteButton plan={plan} />
                        <Separator orientation="vertical" className="h-5" />
                        <PlanChangeNameButton plan={plan} />
                        <PlanTogglePublicButton plan={plan} />
                      </TableCell>
                    </TableRow>
                  )
                })
              : null}
            {isPending
              ? loadingTableEntries.map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {!userPlans.length && !isPending ? (
              <TableRow>
                <TableCell colSpan={4}>Du har inga planeringar än...</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
