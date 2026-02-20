import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { kårer } from "@data/committees";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Switch } from "@ui/switch";
import { type Kår } from "@/interfaces/interfaces";

export const LockPlanEditingCard = () => {
  const { t } = useTranslation();
  const { lockPlans, planEditLocked } = useAdminSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin_lock_card.title")}</CardTitle>
        <CardDescription>{t("admin_lock_card.description")}</CardDescription>
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
              <p>
                {planEditLocked[kår] ? "Lås upp redigering" : "Lås redigering"}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
