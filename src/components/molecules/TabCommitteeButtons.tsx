import { useTranslation } from "react-i18next";
import { Button } from "@ui/button";

type TabCommitteeButtonsProps = {
  disabled: boolean;
  handleViewBookings: () => void;
  handleViewCollision: () => void;
  handleFindCollisions: () => void;
  showCollisions: boolean;
};

export const TabCommitteeButtons = ({
  disabled,
  handleViewBookings,
  handleFindCollisions,
  handleViewCollision,
  showCollisions,
}: TabCommitteeButtonsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Button
        onClick={handleViewBookings}
        disabled={disabled}
        variant="outline"
      >
        {t("view_bookings")}
      </Button>
      {showCollisions ? (
        <Button onClick={handleViewCollision}>{t("view_collisions")}</Button>
      ) : (
        <Button onClick={handleFindCollisions} variant={"secondary"}>
          {t("find_collisions")}
        </Button>
      )}
    </>
  );
};
