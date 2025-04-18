import { useAdminSettings } from "@hooks/useAdminSettings";
import { CURRENT_YEAR } from "@utils/CONSTANTS";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { DatePicker } from "@ui/date-picker";

export const MottagningStartDateCard = () => {
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
