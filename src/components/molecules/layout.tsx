import { Header } from "./header";
import { SiteFooter } from "./siteFooter";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
};
