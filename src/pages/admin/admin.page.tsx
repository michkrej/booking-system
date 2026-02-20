import { useTranslation } from "react-i18next";
import { Layout } from "@components/molecules/layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { BookableItemsCard } from "@/pages/admin/components/BookableItemsCard";
import { MottagningStartDateCard } from "@/pages/admin/components/MottagningStartDateCard";
import { LockPlanEditingCard } from "./components/LockPlanEditCard";

export const AdminPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("admin_card.title")}</CardTitle>
            <CardDescription>{t("admin_card.description")}</CardDescription>
          </CardHeader>
        </Card>
        <BookableItemsCard />
        <MottagningStartDateCard />
        <LockPlanEditingCard />
      </div>
    </Layout>
  );
};
