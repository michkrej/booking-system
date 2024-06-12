import { File } from 'lucide-react'
import { useMemo } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, getCommittee } from '@/lib/utils'
import { usePublicPlans, useUser } from '@/state'
import { Kår, Plan } from '@/utils/interfaces'
import { Button } from '../ui/button'

type TabCommitteeSectionProps = {
  kår: Kår
  plans: Plan[]
}

const TabCommitteeSection = ({ kår, plans }: TabCommitteeSectionProps) => {
  return (
    <TabsContent value={kår.toLowerCase()}>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{kår} planeringar</CardTitle>
          <CardDescription>Publika planeringar för fadderier inom {kår}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fadderi</TableHead>
                <TableHead className="hidden sm:table-cell">Uppdaterad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const committee = getCommittee(plan.committeeId)
                return (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{committee?.text}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(plan.updatedAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
              {plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}>Det finns inga publika planeringar för {kår}.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export const PublicPlansCard = () => {
  const { user } = useUser()
  const publicPlans = usePublicPlans()

  const defaultTab = useMemo(() => {
    const committee = getCommittee(user.committeeId)
    return (committee?.kår || 'all').toLowerCase()
  }, [user.committeeId])

  const plansLinTek = useMemo(() => {
    return publicPlans.filter((plan) => getCommittee(plan.committeeId)?.kår === 'LinTek')
  }, [publicPlans])

  const plansConsensus = useMemo(() => {
    return publicPlans.filter((plan) => getCommittee(plan.committeeId)?.kår === 'Consensus')
  }, [publicPlans])

  const plansStuFF = useMemo(() => {
    return publicPlans.filter((plan) => getCommittee(plan.committeeId)?.kår === 'StuFF')
  }, [publicPlans])

  return (
    <Tabs defaultValue={defaultTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Alla</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="lintek">LinTek</TabsTrigger>
          <TabsTrigger value="stuff">StuFF</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>
      {/* SECTION - all */}
      <TabsContent value="all">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Alla planeringar</CardTitle>
            <CardDescription>Publika planeringar för alla kårer.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fadderi</TableHead>
                  <TableHead>Kår</TableHead>
                  <TableHead className="hidden sm:table-cell">Uppdaterad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicPlans.map((plan) => {
                  const committee = getCommittee(plan.committeeId)
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{committee?.text}</TableCell>
                      <TableCell>{committee?.kår}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(plan.updatedAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {publicPlans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>Det finns inga publika planeringar.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      {/* SECTION - Consensus */}
      <TabCommitteeSection plans={plansConsensus} kår={'Consensus'} />
      {/* SECTION - LinTek */}
      <TabCommitteeSection plans={plansLinTek} kår={'LinTek'} />
      {/* SECTION - StuFF */}
      <TabCommitteeSection plans={plansStuFF} kår={'StuFF'} />
    </Tabs>
  )
}
