import { Navigate, useLocation } from "react-router-dom";
import { SiteLogo } from "@components/atoms/siteLogo";
import { SiteFooter } from "@components/molecules/siteFooter";
import { NollePCarousel } from "@components/organisms/nollePCarousel";
import { FormForgotPassword } from "@/components/organisms/FormForgotPassword";
import { FormLogin } from "@/components/organisms/FormLogin";
import { FormSignup } from "@/components/organisms/FormSignup";
import { useAuthContext } from "@/hooks/useAuthContext";

export function LoginPage() {
  const { state } = useLocation() as { state: { mode?: string } };
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:overflow-y-hidden lg:grid lg:grid-cols-2">
      <div className="fixed top-0 m-2">
        <SiteLogo />
      </div>
      <div className="relative mt-20 flex items-center justify-center lg:mt-0 flex-1">
        {state?.mode === "forgotPassword" ? (
          <FormForgotPassword />
        ) : state?.mode === "signup" ? (
          <FormSignup />
        ) : (
          <FormLogin />
        )}
        <div className="absolute bottom-0 w-full justify-center mt-auto">
          <SiteFooter />
        </div>
      </div>

      <div className="relative hidden h-full w-full lg:block">
        <NollePCarousel />
      </div>
    </div>
  );
}
