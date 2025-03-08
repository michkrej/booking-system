import { File } from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { LoadingButton } from "./loadingButton";
import { usePublicPlans } from "@/hooks/usePublicPlans";
import { getCommittee } from "@/lib/utils";
import { type Kår, type Plan } from "@/utils/interfaces";
import { exportPlans } from "@/utils/helpers";
import { toast } from "sonner";

const getPlans = (plans: Plan[], kår: Omit<Kår, "Övrigt"> | "all") => {
  if (kår === "all") return plans;
  return plans.filter(
    (plan) => getCommittee(plan.committeeId)?.kår.toLowerCase() === kår,
  );
};

export const ExportPlansButton = () => {
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
      toast.error("Exportering misslyckades", {
        description: "Det fanns ingen data att exportera för den valda kåren",
      });
      return;
    }

    const csv = generateCsv(csvConfig)(data);

    download(csvConfig)(csv);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportera planeringar</DialogTitle>
          <DialogDescription className="space-y-1.5">
            <p>
              Exporterar planeringarnas data till en CSV fil. Filen går att
              öppna i bland annat Excel eller Google Sheets.{" "}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1">
          <div className="mb-2">
            <Label>Välj kår</Label>
            <Select value={committee} onValueChange={setCommittee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla</SelectItem>
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
            <p>Exportera endast bokningsbara områden på campus Valla</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={includeInventory}
              onCheckedChange={() => setIncludeInventory((prev) => !prev)}
            />
            <p>Inkludera inventarier</p>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton size="sm" onClick={handleExport} loading={false}>
            Exportera
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
