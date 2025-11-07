"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (auth.isLoading || auth.isVerifyingToken) {
      return;
    }

    const isLoginPage = pathname === "/";

    if (!auth.isAuthenticated && !isLoginPage) {
      router.replace("/");
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.isVerifyingToken, pathname, router]);

  if (auth.isVerifyingToken) {
    return (
      <AuthContext.Provider value={auth}>
        <LoadingScreen />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
