import { Button } from "../ui/button";

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
  return (
    <>
      <Button
        onClick={handleViewBookings}
        disabled={disabled}
        variant="outline"
      >
        Se bokningar
      </Button>
      {showCollisions ? (
        <Button onClick={handleViewCollision}>Se krockar</Button>
      ) : (
        <Button onClick={handleFindCollisions} variant={"secondary"}>
          Hitta krockar
        </Button>
      )}
    </>
  );
};
