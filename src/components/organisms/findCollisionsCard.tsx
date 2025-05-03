import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useFindCollisionsCard } from "@/hooks/useFindCollisionsCard";
import { CollisionsTable } from "../molecules/CollisonsTable";

export const FindCollisionsCard = () => {
  const {
    userPlans,
    showCollisionsButtonEnabled,
    onChangeSelect,
    onButtonClick,
  } = useFindCollisionsCard();

  return (
    <Card className="col-span-full">
      <CardHeader className="grid content-between sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Hitta krockar</CardTitle>
          <CardDescription>
            Hitta krockar mellan dina och andra fadderiers bokningar.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select onValueChange={onChangeSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Välj planering..." />
            </SelectTrigger>
            <SelectContent>
              {userPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            disabled={!showCollisionsButtonEnabled}
            onClick={onButtonClick}
          >
            Se krockar grafiskt
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <CollisionsTable />
      </CardContent>
    </Card>
  );
};
