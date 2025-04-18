import { useAdminSettings } from "@hooks/useAdminSettings";
import { kårer } from "@data/committees";
import { type Kår } from "@utils/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Switch } from "@ui/switch";

export const LockPlanEditingCard = () => {
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
