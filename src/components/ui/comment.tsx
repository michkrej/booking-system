import { type ReactNode } from "react";
import { cn } from "@/utils/utils";

const Comment = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-xs text-gray-500", className)}>{children}</p>;
};

export { Comment };
