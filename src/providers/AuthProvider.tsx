import type { UserCredential } from "firebase/auth";
import { useAtom } from "jotai";
import { createContext, useEffect, useState } from "react";
import { SiteLogo } from "@/components/atoms/siteLogo";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/interfaces/interfaces";
import { authService } from "@/services";
import { auth } from "@/services/config";
import { userAtom } from "@/state/atoms";

const AuthContext = createContext<{ user: User | null; isLoading: boolean }>({
  user: null,
  isLoading: true,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetails = async (fbUser: UserCredential["user"]) => {
    const details = await authService.getUserDetails(fbUser);

    setUser(details);
  };

  useEffect(() => {
    const listener = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        await getUserDetails(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      listener();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col md:overflow-y-hidden">
        <div className="fixed top-0 m-2">
          <SiteLogo />
        </div>

        <div className="relative mt-20 flex items-center justify-center h-full flex-1">
          <Spinner className="size-40 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
