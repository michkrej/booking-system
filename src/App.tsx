import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { toast, Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminPage } from "./pages/admin.page";
import { DashboardPage } from "./pages/dashboard.page";
import { LoginPage } from "./pages/login.page";
import { BookingPage } from "./pages/Booking/booking.page";
import { useUserIsLoggedIn } from "./hooks/useUserIsLoggedIn";

const queryClient = new QueryClient();

const RequireAuth = () => {
  const location = useLocation();
  const userIsLoggedIn = useUserIsLoggedIn();

  if (!userIsLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page. Not that it matters much in this case.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
};

function App() {
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
