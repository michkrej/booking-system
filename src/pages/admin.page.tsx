import { Layout } from "@/components/molecules/layout";
import { LoadingButton } from "@/components/molecules/loadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { kårer } from "@/data/committees";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { BOOKABLE_ITEM_OPTIONS, CURRENT_YEAR } from "@/utils/CONSTANTS";
import { type Kår } from "@/utils/interfaces";
import { useMemo, useState } from "react";

export const AdminPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>
              Här kan du justera diverse inställningar för bokningsplaneringen.
              Dina ändringar påverkar alla som har tillgång till systemet.
            </CardDescription>
          </CardHeader>
        </Card>
        <BookableItemsCard />
        <MottagningStartDateCard />
        <LockPlanEditingCard />
      </div>
    </Layout>
  );
};

const MottagningStartDateCard = () => {
  const { mottagningStart, updateMottagningStart } = useAdminSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mottagningen {CURRENT_YEAR} startar</CardTitle>
        <CardDescription>
          Här kan du justera startdatum för mottagningen för samtliga kårer.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="grid grid-cols-[100px_auto] gap-2">
          <p>Consensus: </p>
          <DatePicker
            date={mottagningStart.Consensus}
            setDate={(date) =>
              updateMottagningStart.mutate({ date, kår: "Consensus" })
            }
          />
        </div>
        <div className="grid grid-cols-[100px_auto] gap-2">
          <p>Stuff: </p>
          <DatePicker
            date={mottagningStart.StuFF}
            setDate={(date) =>
              updateMottagningStart.mutate({ date, kår: "StuFF" })
            }
          />
        </div>
        <div className="grid grid-cols-[100px_auto] gap-2">
          <p>LinTek: </p>
          <DatePicker
            date={mottagningStart.LinTek}
            setDate={(date) =>
              updateMottagningStart.mutate({ date, kår: "LinTek" })
            }
          />
        </div>
        <div className="grid grid-cols-[100px_auto] gap-2">
          <p>Övrigt: </p>
          <DatePicker
            date={mottagningStart.Övrigt}
            setDate={(date) =>
              updateMottagningStart.mutate({ date, kår: "Övrigt" })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

const LockPlanEditingCard = () => {
  const { lockPlans, planEditLocked } = useAdminSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lås redigering av bokningar</CardTitle>
        <CardDescription>
          Som administratör kan du låsa redigering av bokningar för att
          förhindra att fadderisterna ändrar i sina bokningar efter
          bokningsmötet eller liknande.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {(Object.keys(kårer) as Kår[]).map((kår) => {
          return (
            <div className="flex items-center gap-2" key={kår}>
              <p className="w-[100px]">{kår}</p>
              <Switch
                checked={planEditLocked[kår]}
                onCheckedChange={() =>
                  lockPlans.mutate({ kår, newValue: !planEditLocked[kår] })
                }
                className="h-6 w-10 rounded-full bg-gray-200"
              />
              <p>{planEditLocked ? "Lås upp redigering" : "Lås redigering"}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const BookableItemsCard = () => {
  const { bookableItems, updateBookableItems } = useAdminSettings();
  const [items, setItems] = useState(bookableItems);

  const itemsAmountsHaveChanged = useMemo(
    () =>
      Object.entries(items).some(
        ([key, value]) =>
          value !== bookableItems[key as keyof typeof bookableItems],
      ),
    [items, bookableItems],
  );

  const handleChange = (item: keyof typeof items, value: string) => {
    setItems((prev) => ({
      ...prev,
      [item]: isNaN(parseInt(value)) ? prev[item] : parseInt(value),
    }));
  };

  return (
    <Card className="row-span-3">
      <CardHeader>
        <CardTitle>Bokningsbart material</CardTitle>
        <CardDescription>
          Här kan du justera antalet av diverse bokningsbara material som finns
          tillgängliga för fadderisterna att boka. <br /> <br /> När du letar
          krockar kommer bokningar som överlappar i tid och överskrider mängden
          av nedan angivna material att visas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(items).map(([item, value]) => {
          const bookableItemData = BOOKABLE_ITEM_OPTIONS.find(
            (i) => i.key === item,
          );
          return (
            <div className="grid grid-cols-[150px_auto] gap-2" key={item}>
              <Label>{bookableItemData?.value ?? item}</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) =>
                  handleChange(item as keyof typeof items, e.target.value)
                }
              />
            </div>
          );
        })}

        <LoadingButton
          loading={updateBookableItems.isPending}
          disabled={!itemsAmountsHaveChanged}
          onClick={() => updateBookableItems.mutate(items)}
        >
          Spara
        </LoadingButton>
        <p className="text-center text-xs">
          Om det saknas något material mejla mig så kan jag lägga till det.
        </p>
      </CardContent>
    </Card>
  );
};
