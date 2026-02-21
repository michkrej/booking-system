import { ArrowRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreUser } from "@hooks/useStoreUser";
import { useUserPlans } from "@hooks/useUserPlans";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { useUserPlanConflicts } from "@/hooks/useUserPlanConflicts";
import { useBoundStore } from "@/state/store";
import type { CollisionDisplayRow } from "@/utils/collisionComputation";
import { viewCollisionsPath } from "@/utils/constants";
import { cn, getCommittee } from "@/utils/utils";
import { FadderiTag } from "../molecules/FadderiTag";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const TABS = {
  Alla: { label: "Alla", value: "all" },
  "Din kår": { label: "Din kår", value: "own" },
} as const;

export const UserConflictsCard = () => {
  const navigate = useNavigate();
  const { user } = useStoreUser();
  const { userPlans } = useUserPlans();
  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const { updatedCurrentDate } = useCurrentDate();
  const { conflictRows } = useUserPlanConflicts();

  const [karFilter, setKarFilter] = useState<
    (typeof TABS)[keyof typeof TABS]["value"]
  >(TABS["Din kår"].value);

  // Find user's public plan
  const userPublicPlan = useMemo(() => {
    return userPlans.find((plan) => plan.public);
  }, [userPlans]);

  // Filter by kår
  const filteredRows = useMemo(() => {
    if (karFilter === "all") return conflictRows;

    return conflictRows.filter((row) => {
      const otherCommittee = getCommittee(row.plan2.committeeId);
      return otherCommittee?.kår === user.kår;
    });
  }, [conflictRows, karFilter, user.kår]);

  const handleViewTimeline = (
    row: CollisionDisplayRow,
    newTab: boolean = false,
  ) => {
    loadedBookings(row.bookings);
    changedActivePlans([row.plan1, row.plan2]);

    const startDate = row.bookings.at(0)?.startDate;
    if (startDate) {
      updatedCurrentDate(startDate);
    }

    const path =
      row.type === "room"
        ? `/booking/${viewCollisionsPath}`
        : `/inventory/${viewCollisionsPath}`;
    if (newTab) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  const handleViewAllConflictsTimeline = () => {
    if (!userPublicPlan) return;

    const hasRoomCollisions = conflictRows.some((conf) => conf.type === "room");

    const conflictBookings = hasRoomCollisions
      ? conflictRows
          .filter((row) => row.type === "room")
          .flatMap((row) => row.bookings)
      : conflictRows
          .filter((row) => row.type === "inventory")
          .flatMap((row) => row.bookings);
    const conflictPlans = conflictRows.flatMap((row) => row.plan2);

    loadedBookings(conflictBookings);
    changedActivePlans([userPublicPlan, ...conflictPlans]);

    updatedCurrentDate(conflictBookings[0]!.startDate);

    if (hasRoomCollisions) {
      navigate(`/booking/${viewCollisionsPath}`);
    } else {
      navigate(`/inventory/${viewCollisionsPath}`);
    }
  };

  if (!userPublicPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Krockar med din planering</CardTitle>
          <CardDescription>
            Du har ingen publik planering. Publicera en planering för att se
            krockar.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const userCommittee = getCommittee(userPublicPlan.committeeId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Krockar med din planering</CardTitle>
            <CardDescription>
              Baserat på {userCommittee?.name || userPublicPlan.label} (publik)
            </CardDescription>
          </div>
          <div className="flex justify-between flex-1 sm:flex-auto sm:justify-end">
            <ToggleGroup
              type="single"
              size="sm"
              value={karFilter}
              onValueChange={(value) => setKarFilter(value as "own" | "all")}
              spacing={0}
            >
              <ToggleGroupItem value="own">Din kår</ToggleGroupItem>
              <ToggleGroupItem value="all">Alla</ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={handleViewAllConflictsTimeline}
            >
              Tidslinje <ArrowRightIcon className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Ditt fadderi
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Krockar med
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide w-[80px]">
                Typ
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">
                Detaljer
              </TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  {conflictRows.length === 0
                    ? "Inga krockar hittades"
                    : `Inga krockar inom ${user.kår}`}
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => {
                const userCommittee = getCommittee(row.plan1.committeeId);
                const otherCommittee = getCommittee(row.plan2.committeeId);

                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-l-[3px] last:border-l-[3px]!",
                      row.type === "room"
                        ? "border-l-red-500"
                        : "border-l-orange-300",
                    )}
                  >
                    <TableCell
                      onClick={() => handleViewTimeline(row)}
                      onAuxClick={() => handleViewTimeline(row, true)}
                      className="hover:cursor-pointer hover:underline"
                    >
                      <FadderiTag
                        name={userCommittee?.name || row.plan1.label}
                        kar={userCommittee?.kår || "Övrigt"}
                        color={userCommittee?.color || "#808080"}
                        compact
                      />
                    </TableCell>
                    <TableCell>
                      <FadderiTag
                        name={otherCommittee?.name || row.plan2.label}
                        kar={otherCommittee?.kår || "Övrigt"}
                        color={otherCommittee?.color || "#808080"}
                        compact={karFilter !== "all"}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 w-fit ${
                          row.type === "room"
                            ? "bg-red-50 border border-red-200 text-red-600"
                            : "bg-orange-50 border border-orange-200 text-orange-600"
                        }`}
                      >
                        {row.type === "room" ? "Lokal" : "Inventarie"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground truncate">
                        {row.detail}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTimeline(row)}
                        onAuxClick={() => handleViewTimeline(row, true)}
                      >
                        Visa <ArrowRightIcon className="ml-1 size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
