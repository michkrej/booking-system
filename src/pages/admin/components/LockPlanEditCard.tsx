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
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Kår } from "@/interfaces/interfaces";

export const LockPlanEditingCard = () => {
  const { t } = useTranslation();
  const { updateLockedKårPlans, settings } = useAdminSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin_lock_card.title")}</CardTitle>
        <CardDescription>{t("admin_lock_card.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {(Object.keys(kårer) as Kår[]).map((kår) => {
          return (
            <div className="flex items-center gap-2" key={kår}>
              <Label className="min-w-[100px]">{kår}</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                defaultValue={
                  settings.planEditLocked[kår] ? "locked" : "unlocked"
                }
                onValueChange={(value) =>
                  updateLockedKårPlans.mutate({
                    kår,
                    newValue: value === "locked",
                  })
                }
              >
                <ToggleGroupItem value="unlocked">upplåst</ToggleGroupItem>
                <ToggleGroupItem value="locked">låst</ToggleGroupItem>
              </ToggleGroup>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
