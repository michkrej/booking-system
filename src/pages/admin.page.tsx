import { DatePicker } from "@/components/molecules/datePicker";
import { Layout } from "@/components/molecules/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminSettings } from "@/hooks";
import { useMottagningStart, usePlanEditLock } from "@/state";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export const AdminPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>
              Här kan du justera diverse inställningar för systemet.
            </CardDescription>
          </CardHeader>
        </Card>
        {/* <BookableItemsCard /> */}
        <MottagningStartDateCard />
        <LockPlanEditingCard />
      </div>
    </Layout>
  );
};

const MottagningStartDateCard = () => {
  const { mottagningStart } = useMottagningStart();
  const { updateMottagningStart } = useAdminSettings();

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
      </CardContent>
    </Card>
  );
};

const LockPlanEditingCard = () => {
  const { lockPlans } = useAdminSettings();
  const { planEditLocked } = usePlanEditLock();

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
        <div className="flex items-center gap-2">
          <p>Lås redigering av bokningar</p>
          <Switch
            checked={planEditLocked}
            onCheckedChange={lockPlans.mutate}
            className="h-6 w-10 rounded-full bg-gray-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// TODO - actually make this card do things
const items = {
  grillar: 8,
  bardiskar: 6,
  "bankset-hg": 20,
  "bankset-k": 25,
  "bankset-hoben": 50,
  trailer: 1,
  tents: 4,
  scene: 10,
  elverk: 1,
};

const BookableItemsCard = () => {
  return (
    <Card className="row-span-3">
      <CardHeader>
        <CardTitle>Bokningsbart material</CardTitle>
        <CardDescription>
          Här kan du justera antalet av diverse bokningsbara material som finns
          tillgängliga för fadderisterna att boka.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.keys(items).map((item) => (
          <div className="grid grid-cols-[100px_auto] gap-2" key={item}>
            <Label>{item}</Label>
            <Input type="number" value={items[item]} />
          </div>
        ))}
        <Button>Spara</Button>
      </CardContent>
    </Card>
  );
};
