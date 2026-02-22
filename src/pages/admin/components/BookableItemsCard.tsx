import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminSettings } from "@hooks/useAdminSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import type { NumericBookableKeys } from "@/interfaces/interfaces";
import { BOOKABLE_ITEM_OPTIONS } from "@/utils/constants";

export const BookableItemsCard = () => {
  const {
    settings: { bookableItems },
    updateBookableItems,
  } = useAdminSettings();
  const [items, setItems] =
    useState<Record<NumericBookableKeys, string | number>>(bookableItems);
  const { t } = useTranslation();

  const itemsAmountsHaveChanged = useMemo(
    () =>
      Object.entries(items).some(
        ([key, value]) =>
          value !== "" &&
          Number(value) !== bookableItems[key as keyof typeof bookableItems],
      ),
    [items, bookableItems],
  );

  return (
    <Card className="row-span-3">
      <CardHeader>
        <CardTitle>{t("bookable_items.title")}</CardTitle>
        <CardDescription>{t("bookable_items.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.keys(items)
          .sort()
          .map((key) => {
            const bookableItemData = BOOKABLE_ITEM_OPTIONS.find(
              (i) => i.key === key,
            );

            const value = items[key as NumericBookableKeys];
            return (
              <div className="grid grid-cols-[150px_auto] gap-2" key={key}>
                <Label>{bookableItemData?.value ?? key}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={Infinity}
                  step={1}
                  value={value}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setItems((prev) => ({
                      ...prev,
                      [key]:
                        e.target.value === ""
                          ? ""
                          : numericValue < 0
                            ? 0
                            : numericValue,
                    }));
                  }}
                />
              </div>
            );
          })}

        <LoadingButton
          loading={updateBookableItems.isPending}
          disabled={!itemsAmountsHaveChanged}
          onClick={() => {
            const newItems = Object.fromEntries(
              Object.entries(items).map(([key, value]) => [key, Number(value)]),
            );
            updateBookableItems.mutate(newItems);
          }}
        >
          {t("save")}
        </LoadingButton>
        <p className="text-center text-xs">{t("bookable_items.footnote")}</p>
      </CardContent>
    </Card>
  );
};
