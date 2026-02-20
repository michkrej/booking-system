import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
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
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";

export const BookableItemsCard = () => {
  const { bookableItems, updateBookableItems } = useAdminSettings();
  const [items, setItems] = useState(bookableItems);
  const { t } = useTranslation();

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
        <CardTitle>{t("bookable_items.title")}</CardTitle>
        <CardDescription>{t("bookable_items.description")}</CardDescription>
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
          {t("save")}
        </LoadingButton>
        <p className="text-center text-xs">{t("bookable_items.footnote")}</p>
      </CardContent>
    </Card>
  );
};
