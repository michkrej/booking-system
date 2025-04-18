import { useMemo, useState } from "react";
import { useAdminSettings } from "@hooks/useAdminSettings";
import { BOOKABLE_ITEM_OPTIONS } from "@utils/CONSTANTS";
import { LoadingButton } from "@components/molecules/loadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

export const BookableItemsCard = () => {
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
