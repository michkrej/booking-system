import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllConflicts } from "@hooks/useAllConflicts";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { getCommittee } from "@lib/utils";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { locationsNonGrouped } from "@/data/locationsData";
import { useBoundStore } from "@/state/store";
import { viewCollisionsPath } from "@/utils/CONSTANTS";
import { findCollisionsBetweenUserAndPublicPlans } from "@/utils/helpers";
import { type Booking, type Plan } from "@/utils/interfaces";
import { FadderiTag } from "../molecules/FadderiTag";
import { KarTabs } from "../molecules/KarTabs";

const KAR_COLORS: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  LinTek: { color: "#E1007A", bg: "#eff6ff", border: "#bfdbfe" },
  Consensus: {
    color: "#2cb2bf",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  StuFF: { color: "#007858", bg: "bg-orange-50", border: "border-orange-200" },
};

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
  onCreatePlan: () => void;
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
  const { summary } = useAllConflicts();
  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);

  const [karFilter, setKarFilter] = useState<
    (typeof TABS)[keyof typeof TABS]["value"]
  >(TABS.Alla.value);

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

  const handleViewConflict = (row: ConflictRow) => {
    loadedBookings(row.bookings);
    changedActivePlans([row.plan1, row.plan2]);

    if (row.type === "Lokal") {
      navigate(`/booking/${viewCollisionsPath}`);
    } else {
      navigate(`/inventory/${viewCollisionsPath}`);
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
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Inventarie-krockar
            </div>
            <div className="text-2xl font-bold text-orange-600">
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

      {/* All Conflicts Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Alla krockar</CardTitle>
            <KarTabs
              tabs={Object.values(TABS)}
              active={karFilter}
              onSelect={setKarFilter}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_80px_1fr_auto] gap-2 px-5 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Fadderi 1</span>
            <span>Fadderi 2</span>
            <span>Typ</span>
            <span className="hidden sm:block">Detaljer</span>
            <span />
          </div>

          {filteredConflicts.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground">
              Inga krockar hittades
            </div>
          ) : (
            filteredConflicts.slice(0, 10).map((row) => {
              const committee1 = getCommittee(row.plan1.committeeId);
              const committee2 = getCommittee(row.plan2.committeeId);
              const borderColor = row.type === "Lokal" ? "#dc2626" : "#ea580c";

              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[1fr_1fr_80px_1fr_auto] gap-2 items-center px-5 py-3 border-b border-border last:border-b-0"
                  style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}
                >
                  <FadderiTag
                    name={committee1?.name || row.plan1.label}
                    kar={committee1?.kår || "Övrigt"}
                    color={committee1?.color || "#808080"}
                  />
                  <FadderiTag
                    name={committee2?.name || row.plan2.label}
                    kar={committee2?.kår || "Övrigt"}
                    color={committee2?.color || "#808080"}
                  />
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 w-fit ${
                      row.type === "Lokal"
                        ? "bg-red-50 border border-red-200 text-red-600"
                        : "bg-orange-50 border border-orange-200 text-orange-600"
                    }`}
                  >
                    {row.type}
                  </span>
                  <span className="text-sm text-muted-foreground hidden sm:block truncate">
                    {row.detail}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewConflict(row)}
                  >
                    Visa &rarr;
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Per-kår Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["Consensus", "LinTek", "StuFF"] as const).map((kar) => (
          <Card
            key={kar}
            className="border-t-4"
            style={{ borderTopColor: KAR_COLORS[kar]?.color }}
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
