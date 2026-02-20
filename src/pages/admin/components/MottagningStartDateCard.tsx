import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { DatePicker } from "@ui/date-picker";
import { CURRENT_YEAR } from "@/utils/constants";

export const MottagningStartDateCard = () => {
  const { t } = useTranslation();
  const { mottagningStart, updateMottagningStart } = useAdminSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("admin_reception_card.title", { year: CURRENT_YEAR })}
        </CardTitle>
        <CardDescription>
          {t("admin_reception_card.description")}
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
          <p>{t("other")}: </p>
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
