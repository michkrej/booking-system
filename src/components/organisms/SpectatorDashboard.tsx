import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ArrowRightIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllConflicts } from "@hooks/useAllConflicts";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { locationsNonGrouped } from "@/data/locationsData";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { type Booking, type Plan } from "@/interfaces/interfaces";
import { useBoundStore } from "@/state/store";
import { KAR_COLORS } from "@/utils/colors";
import { viewCollisionsPath } from "@/utils/constants";
import { findCollisionsBetweenUserAndPublicPlans } from "@/utils/helpers";
import { getCommittee } from "@/utils/utils";
import { FadderiTag } from "../molecules/FadderiTag";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type ConflictType = "Lokal" | "Inventarie";

interface ConflictRow {
  id: string;
  plan1: Plan;
  plan2: Plan;
  type: ConflictType;
  detail: string;
  bookings: Booking[];
}

interface SpectatorDashboardProps {
  onCreatePlan?: () => void;
}

const TABS = {
  Alla: { label: "Alla", value: "all" },
  Consensus: { label: "Consensus", value: "consensus" },
  LinTek: { label: "LinTek", value: "lintek" },
  StuFF: { label: "StuFF", value: "stuff" },
} as const;

export const SpectatorDashboard = ({
  onCreatePlan,
}: SpectatorDashboardProps) => {
  const navigate = useNavigate();
  const { publicPlans } = usePublicPlans();
  const { summary, getConflictsForPlan } = useAllConflicts();
  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const { updatedCurrentDate } = useCurrentDate();

  const [karFilter, setKarFilter] = useState<
    (typeof TABS)[keyof typeof TABS]["value"]
  >(TABS.Alla.value);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Calculate all conflicts between public plans
  const allConflicts = useMemo(() => {
    const rows: ConflictRow[] = [];
    const seenPairs = new Set<string>();

    publicPlans.forEach((plan) => {
      const otherPlans = publicPlans.filter((p) => p.id !== plan.id);
      const collisions = findCollisionsBetweenUserAndPublicPlans(
        plan,
        otherPlans,
      );

      // Process room collisions
      Object.entries(collisions.roomCollisions).forEach(
        ([planId, bookings]) => {
          if (bookings.length === 0) return;

          // Verify collision involves events from BOTH plans
          const hasEventsFromPlan1 = bookings.some((b) => b.planId === plan.id);
          const hasEventsFromPlan2 = bookings.some((b) => b.planId === planId);
          if (!hasEventsFromPlan1 || !hasEventsFromPlan2) return;

          const pairKey = [plan.id, planId].sort().join("-");
          if (seenPairs.has(pairKey)) return;
          seenPairs.add(pairKey);

          const otherPlan = publicPlans.find((p) => p.id === planId);
          if (!otherPlan) return;

          // Group by location
          const locationMap = new Map<string, Booking[]>();
          bookings.forEach((booking) => {
            const key = booking.locationId;
            if (!locationMap.has(key)) {
              locationMap.set(key, []);
            }
            locationMap.get(key)!.push(booking);
          });

          locationMap.forEach((locationBookings, locationId) => {
            const location = locationsNonGrouped.find(
              (l) => l.id === locationId,
            );
            const firstBooking = locationBookings[0];
            if (!firstBooking) return;
            const dateStr = format(firstBooking.startDate, "d MMM HH:mm", {
              locale: sv,
            });
            const endStr = format(firstBooking.endDate, "HH:mm", {
              locale: sv,
            });

            rows.push({
              id: `room-${pairKey}-${locationId}`,
              plan1: plan,
              plan2: otherPlan,
              type: "Lokal",
              detail: `${location?.name || "Okänd plats"}, ${dateStr}–${endStr}`,
              bookings: locationBookings,
            });
          });
        },
      );

      // Process inventory collisions
      Object.entries(collisions.inventoryCollisions).forEach(
        ([planId, bookings]) => {
          if (bookings.length === 0) return;

          // Verify collision involves events from BOTH plans
          const hasEventsFromPlan1 = bookings.some((b) => b.planId === plan.id);
          const hasEventsFromPlan2 = bookings.some((b) => b.planId === planId);
          if (!hasEventsFromPlan1 || !hasEventsFromPlan2) return;

          const pairKey = [plan.id, planId].sort().join("-inv");
          if (seenPairs.has(pairKey)) return;
          seenPairs.add(pairKey);

          const otherPlan = publicPlans.find((p) => p.id === planId);
          if (!otherPlan) return;

          const firstBooking = bookings[0];
          if (!firstBooking) return;
          const dateStr = format(firstBooking.startDate, "d MMM", {
            locale: sv,
          });

          rows.push({
            id: `inv-${pairKey}`,
            plan1: plan,
            plan2: otherPlan,
            type: "Inventarie",
            detail: `Inventarier, ${dateStr}`,
            bookings,
          });
        },
      );
    });

    return rows;
  }, [publicPlans]);

  // Filter conflicts by kår
  const filteredConflicts = useMemo(() => {
    if (karFilter === "all") return allConflicts;

    return allConflicts.filter((row) => {
      const committee1 = getCommittee(row.plan1.committeeId);
      const committee2 = getCommittee(row.plan2.committeeId);
      return (
        committee1?.kår.toLowerCase() === karFilter.toLowerCase() ||
        committee2?.kår.toLowerCase() === karFilter.toLowerCase()
      );
    });
  }, [allConflicts, karFilter]);

  const totalPages = Math.ceil(filteredConflicts.length / PAGE_SIZE);
  const paginatedConflicts = filteredConflicts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [karFilter]);

  const generatePageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  // Calculate per-kår stats
  const karStats = useMemo(() => {
    const stats = {
      Consensus: 0,
      LinTek: 0,
      StuFF: 0,
    };

    allConflicts.forEach((row) => {
      const committee1 = getCommittee(row.plan1.committeeId);
      const committee2 = getCommittee(row.plan2.committeeId);

      if (committee1?.kår && committee1.kår in stats) {
        stats[committee1.kår as keyof typeof stats]++;
      }
      if (
        committee2?.kår &&
        committee2.kår in stats &&
        committee1?.kår !== committee2?.kår
      ) {
        stats[committee2.kår as keyof typeof stats]++;
      }
    });

    return stats;
  }, [allConflicts]);

  const handleViewAllConflicts = (e: React.MouseEvent<HTMLButtonElement>) => {
    loadedBookings(allConflicts.flatMap((row) => row.bookings));
    const plans = publicPlans
      .filter((plan) => getConflictsForPlan(plan.id) > 0)
      .flatMap((plan) => plan);
    changedActivePlans(plans);

    const date = allConflicts[0]!.bookings[0]!.startDate;
    updatedCurrentDate(date);

    const hasRoomCollisions = allConflicts.some((row) => row.type === "Lokal");

    const url = hasRoomCollisions
      ? `/booking/${viewCollisionsPath}`
      : `/inventory/${viewCollisionsPath}`;

    if (e.ctrlKey || e.metaKey) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };

  const handleViewConflict = (row: ConflictRow, newTab = false) => {
    loadedBookings(row.bookings);
    changedActivePlans([row.plan1, row.plan2]);
    updatedCurrentDate(row.bookings[0]!.startDate);

    const url =
      row.type === "Lokal"
        ? `/booking/${viewCollisionsPath}`
        : `/inventory/${viewCollisionsPath}`;

    if (newTab) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Totala krockar
            </div>
            <div className="text-2xl font-bold text-red-600">
              {summary.total}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Lokal-krockar
            </div>
            <div className="text-2xl font-bold text-red-600">
              {summary.location}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Inventarie-krockar
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {summary.inventory}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Publika planeringar
            </div>
            <div className="text-2xl font-bold text-primary">
              {summary.publicPlansCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Banner */}
      {onCreatePlan && (
        <div className="bg-primary/10 border border-primary/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-foreground">
              Vill du skapa en egen planering?
            </span>
            <span className="text-muted-foreground ml-2">
              Boka events och hitta krockar med andra grupper.
            </span>
          </div>
          <Button onClick={onCreatePlan}>Skapa planering</Button>
        </div>
      )}

      {/* All Conflicts Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Alla krockar</CardTitle>
            <div className="flex  gap-x-4">
              <ToggleGroup
                type="single"
                value={karFilter}
                onValueChange={(value) =>
                  setKarFilter(value as typeof karFilter)
                }
              >
                {Object.values(TABS).map((tab) => (
                  <ToggleGroupItem value={tab.value} key={tab.value}>
                    {tab.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Button onClick={handleViewAllConflicts}>
                Tidslinje <ArrowRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fadderi 1</TableHead>
                <TableHead>Fadderi 2</TableHead>
                <TableHead className="w-[80px]">Typ</TableHead>
                <TableHead className="hidden sm:table-cell">Detaljer</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedConflicts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Inga krockar hittades
                  </TableCell>
                </TableRow>
              ) : (
                paginatedConflicts.map((row) => {
                  const committee1 = getCommittee(row.plan1.committeeId);
                  const committee2 = getCommittee(row.plan2.committeeId);
                  const borderColor =
                    row.type === "Lokal" ? "#dc2626" : "#ea580c";

                  // Determine display order: selected kår's committee goes on the left
                  const shouldSwap =
                    karFilter !== "all" &&
                    committee2?.kår.toLowerCase() === karFilter.toLowerCase() &&
                    committee1?.kår.toLowerCase() !== karFilter.toLowerCase();

                  const [leftPlan, rightPlan] = shouldSwap
                    ? [row.plan2, row.plan1]
                    : [row.plan1, row.plan2];
                  const [leftCommittee, rightCommittee] = shouldSwap
                    ? [committee2, committee1]
                    : [committee1, committee2];

                  const leftDisplayName =
                    leftCommittee?.name === "Övrigt"
                      ? leftPlan.label
                      : leftCommittee?.name || leftPlan.label;
                  const rightDisplayName =
                    rightCommittee?.name === "Övrigt"
                      ? rightPlan.label
                      : rightCommittee?.name || rightPlan.label;

                  return (
                    <TableRow
                      key={row.id}
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: borderColor,
                      }}
                    >
                      <TableCell>
                        <FadderiTag
                          name={leftDisplayName}
                          kar={leftCommittee?.kår || "Övrigt"}
                          color={leftCommittee?.color || "#808080"}
                        />
                      </TableCell>
                      <TableCell>
                        <FadderiTag
                          name={rightDisplayName}
                          kar={rightCommittee?.kår || "Övrigt"}
                          color={rightCommittee?.color || "#808080"}
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 w-fit ${
                            row.type === "Lokal"
                              ? "bg-red-50 border border-red-200 text-red-600"
                              : "bg-orange-50 border border-orange-200 text-orange-600"
                          }`}
                        >
                          {row.type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground truncate">
                          {row.detail}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            handleViewConflict(row, e.ctrlKey || e.metaKey);
                          }}
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

          {totalPages > 1 && (
            <Pagination className="py-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <div className="flex items-center justify-center w-[180px]">
                  {generatePageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                </div>
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Per-kår Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["Consensus", "LinTek", "StuFF"] as const).map((kar) => (
          <Card
            key={kar}
            className="border-t-4"
            style={{ borderTopColor: KAR_COLORS[kar].color }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-sm font-bold text-foreground">{kar}</div>
              <div className="text-2xl font-bold text-red-600">
                {karStats[kar]}
              </div>
              <div className="text-xs text-muted-foreground">
                aktiva krockar
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
