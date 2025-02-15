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
import { BookingPage } from "./pages/booking.page";

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
                <Route path="/booking" element={<BookingPage />} />
              </Route>
              {/*<Route exact path="/resetPassword" element={<ForgotPassword />} />
          <Route element={<RequireAuth />}>
            <Route exact path="/booking/:id/:year" element={<CalendarView />} />
            <Route exact path="/collisions/:id/:year" element={<CalendarView findCollisions />} />
            <Route
              exact
              path="/collisions/all/:id/:year"
              element={<CalendarView findCollisions />}
            />
            <Route exact path="/overview" element={<Overview />} />
            <Route exact path="/allEvents/:id/:year" element={<CalendarView showAllEvents />} />
          </Route> */}
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Oops, denna sidan är tom!</p>
                  </main>
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
