import { cn } from "@/utils/utils";
import { Header } from "./header";
import { SiteFooter } from "./siteFooter";

export const Layout = ({
  children,
  className,
  hideFooter = false,
}: {
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
}) => {
  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <Header />
      <main
        className={cn(
          "flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 sm:px-6",
          className,
        )}
      >
        {children}
      </main>
      {hideFooter ? null : <SiteFooter />}
    </div>
  );
};
