import { LoaderCircle } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={loading || disabled}>
      {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : null}
      {children}
    </Button>
  );
};

export { LoadingButton };

export type { LoadingButtonProps };
