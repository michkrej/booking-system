import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@ui/button";
import { cn } from "@/utils/utils";

interface InlineYearSelectorProps {
  year: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isMinYear?: boolean;
  isMaxYear?: boolean;
  className?: string;
}

export const InlineYearSelector = ({
  year,
  onIncrement,
  onDecrement,
  isMinYear = false,
  isMaxYear = false,
  className,
}: InlineYearSelectorProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={isMinYear}
        onClick={onDecrement}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-bold text-foreground min-w-[4ch] text-center">
        {year}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={isMaxYear}
        onClick={onIncrement}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
