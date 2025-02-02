import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getCommittee } from "@/lib/utils";
import { type Kår, type Plan } from "@/utils/interfaces";
import { ExportPlansButton } from "../molecules/exportPlansButton";
import { usePublicPlans } from "@/hooks";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/state";

type TabCommitteeSectionProps = {
  kår: Kår;
  plans: Plan[];
  isPending: boolean;
};

const TabCommitteeSection = ({
  kår,
  plans,
  isPending,
}: TabCommitteeSectionProps) => {
  return (
    <TabsContent value={kår.toLowerCase()}>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{kår} planeringar</CardTitle>
          <CardDescription>
            Publika planeringar för fadderier inom {kår}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fadderi</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Uppdaterad
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const committee = getCommittee(plan.committeeId);
                return (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      {committee?.text}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(plan.updatedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isPending && plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}>
                    Det finns inga publika planeringar för {kår}.
                  </TableCell>
                </TableRow>
              )}
              {isPending ? (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export const PublicPlansCard = () => {
  const { user } = useUser();
  const { publicPlans, isPending } = usePublicPlans();

  const defaultTab = useMemo(() => {
    const committee = getCommittee(user.committeeId);
    return (committee?.kår || "all").toLowerCase();
  }, [user.committeeId]);

  const plansLinTek = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "LinTek",
    );
  }, [publicPlans]);

  const plansConsensus = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "Consensus",
    );
  }, [publicPlans]);

  const plansStuFF = useMemo(() => {
    return publicPlans.filter(
      (plan) => getCommittee(plan.committeeId)?.kår === "StuFF",
    );
  }, [publicPlans]);

  return (
    <Tabs defaultValue={defaultTab} className="col-span-2">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Alla</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="lintek">LinTek</TabsTrigger>
          <TabsTrigger value="stuff">StuFF</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ExportPlansButton />
        </div>
      </div>
      {/* SECTION - all */}
      <TabsContent value="all">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Alla planeringar</CardTitle>
            <CardDescription>
              Publika planeringar för alla kårer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fadderi</TableHead>
                  <TableHead>Kår</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Uppdaterad
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicPlans.map((plan) => {
                  const committee = getCommittee(plan.committeeId);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {committee?.text}
                      </TableCell>
                      <TableCell>{committee?.kår}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(plan.updatedAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!isPending && !publicPlans.length ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      Det finns inga publika planeringar.
                    </TableCell>
                  </TableRow>
                ) : null}
                {isPending ? (
                  <TableRow>
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
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      {/* SECTION - Consensus */}
      <TabCommitteeSection
        plans={plansConsensus}
        kår={"Consensus"}
        isPending={isPending}
      />
      {/* SECTION - LinTek */}
      <TabCommitteeSection
        plans={plansLinTek}
        kår={"LinTek"}
        isPending={isPending}
      />
      {/* SECTION - StuFF */}
      <TabCommitteeSection
        plans={plansStuFF}
        kår={"StuFF"}
        isPending={isPending}
      />
    </Tabs>
  );
};
