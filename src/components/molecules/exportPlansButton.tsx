import { download, generateCsv, mkConfig } from "export-to-csv";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usePublicPlans } from "@hooks/usePublicPlans";
import { exportPlans } from "@utils/helpers";
import { type Kår, type Plan } from "@utils/interfaces";
import { getCommittee } from "@lib/utils";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Label } from "@ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { LoadingButton } from "./loadingButton";

const getPlans = (plans: Plan[], kår: Omit<Kår, "Övrigt"> | "all") => {
  if (kår === "all") return plans;
  return plans.filter(
    (plan) => getCommittee(plan.committeeId)?.kår.toLowerCase() === kår,
  );
};

export const ExportPlansButton = () => {
  const { t } = useTranslation();
  const [committee, setCommittee] = useState("all");
  const [onlyBookableLocationValla, setOnlyBookableLocationValla] =
    useState(false);
  const [includeInventory, setIncludeInventory] = useState(false);

  const { publicPlans } = usePublicPlans();

  const handleExport = async () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
    });
    const plans = getPlans(publicPlans, committee);

    const data = await exportPlans(
      plans,
      onlyBookableLocationValla,
      includeInventory,
    );

    if (!data.length) {
      toast.error(t("export.toast.error.header"), {
        description: t("export.toast.error.description"),
      });
      return;
    }

    const csv = generateCsv(csvConfig)(data);

    download(csvConfig)(csv);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8">
          <DownloadIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("export.title")}</DialogTitle>
          <DialogDescription className="space-y-1.5">
            <p>{t("export.description")}</p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1">
          <div className="mb-2">
            <Label>{t("export.choose_corps")}</Label>
            <Select value={committee} onValueChange={setCommittee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="consensus">Consensus</SelectItem>
                <SelectItem value="lintek">LinTek</SelectItem>
                <SelectItem value="stuff">StuFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={onlyBookableLocationValla}
              onCheckedChange={() =>
                setOnlyBookableLocationValla((prev) => !prev)
              }
            />
            <p>{t("export.export_only_bookable_locations_campus_valla")}</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={includeInventory}
              onCheckedChange={() => setIncludeInventory((prev) => !prev)}
            />
            <p>{t("export.include_inventory")}</p>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton size="sm" onClick={handleExport} loading={false}>
            {t("export.do_export")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
