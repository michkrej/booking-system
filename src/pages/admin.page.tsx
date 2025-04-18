import { Layout } from "@components/molecules/layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { BookableItemsCard } from "@/components/organisms/BookableItemsCard";
import { LockPlanEditingCard } from "@/components/organisms/LockPlanEditCard";
import { MottagningStartDateCard } from "@/components/organisms/MottagningStartDateCard";

export const AdminPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>
              Här kan du justera diverse inställningar för bokningsplaneringen.
              Dina ändringar påverkar alla som har tillgång till systemet.
            </CardDescription>
          </CardHeader>
        </Card>
        <BookableItemsCard />
        <MottagningStartDateCard />
        <LockPlanEditingCard />
      </div>
    </Layout>
  );
};
