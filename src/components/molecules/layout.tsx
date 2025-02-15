import { cn } from "@/lib/utils";
import { Header } from "./header";
import { SiteFooter } from "./siteFooter";

export const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className={cn("flex flex-1 flex-col gap-4 p-4 sm:px-6", className)}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
