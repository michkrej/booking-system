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
    <div className="bg-muted flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <main className={cn("flex flex-1 flex-col gap-4 py-6 px-4 sm:px-7")}>
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
