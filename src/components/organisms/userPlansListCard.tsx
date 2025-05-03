import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { usePlansListCard } from "@/hooks/usePlansListCard";
import { UserPlansListRow } from "../molecules/UserPlansListRow";

const loadingTableEntries = Array.from({ length: 1 }, (_, i) => i);

export const UserPlansListCard = () => {
  const { t } = useTranslation();

  const { userPlans, isPending, handlePlanClick } = usePlansListCard();

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle>{t("your_plans")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("num_bookings")}</TableHead>
              <TableHead>{t("created")}</TableHead>
              <TableHead>{t("updated")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isPending ? (
              userPlans.length > 0 ? (
                userPlans.map((plan) => (
                  <UserPlansListRow
                    key={plan.id}
                    plan={plan}
                    onPlanClick={handlePlanClick}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    {t("you_do_not_have_any_plans_yet")}
                  </TableCell>
                </TableRow>
              )
            ) : (
              loadingTableEntries.map((index) => (
                <TableRow key={`table-row-${index}`}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
