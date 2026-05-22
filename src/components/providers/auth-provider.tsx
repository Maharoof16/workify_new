"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin } from "@/store/slice/auth-slice";
import type { RootState } from "@/store/store";
import { AuthService } from "@/modules/auth/auth.service";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const isAuthenticated = useSelector((state: RootState) => state.auth.status);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const hasCode = params.has("code");

          if (hasCode) {
            setIsLoading(false);
            return;
          }
        }

        if (user && isAuthenticated) {
          setIsLoading(false);
          return;
        }

        const res = await AuthService.me();
        if (res && isMounted) {
          dispatch(authLogin(res));
        }
      } catch (err) {
        console.log("No active session");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
