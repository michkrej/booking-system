import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadMessages, locale } from "devextreme/localization";
import seMessages from "devextreme/localization/messages/sv.json";
import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminPage } from "./pages/admin.page";
import { DashboardPage } from "./pages/dashboard.page";
import { LoginPage } from "./pages/login.page";
import { useHasUser } from "./state/store";
import { BookingPage } from "./pages/Booking/booking.page";
import { Layout } from "./components/molecules/layout";

const queryClient = new QueryClient();

const RequireAuth = () => {
  const hasUser = useHasUser();
  const location = useLocation();

  if (!hasUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page. Not that it matters much in this case.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
};

function App() {
  useEffect(() => {
    loadMessages(seMessages);
    locale(navigator.language);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
              </Route>
              <Route
                path="*"
                element={
                  <Layout>
                    <div className="flex h-[calc(100vh-155px)] flex-col items-center justify-center">
                      Oops, denna sidan är tom!
                    </div>
                  </Layout>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
