import { cn } from "@/utils/utils";
import { Header } from "./header";
import { SiteFooter } from "./siteFooter";

export const DashboardLayout = ({
  children,
  sidebar,

  hideFooter = false,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
}) => {
  return (
    <div className="bg-muted flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <div className="flex flex-1">
        <main
          className={cn(
            "flex flex-1 flex-col sm:gap-4 gap-2 py-2 sm:py-6 px-2 sm:px-7",
          )}
        >
          {children}
        </main>
        <aside className="hidden lg:block w-[340px] border-l bg-card overflow-y-auto">
          {sidebar}
        </aside>
      </div>
      {hideFooter ? null : <SiteFooter />}
    </div>
  );
};
