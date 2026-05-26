import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

function readSession() {
  if (!authService.isLoggedIn()) return null;
  return {
    username: authService.getUserName(),
    role: authService.getAppRole(),
    orgName: authService.getRole(),
    user: authService.getCurrentUser(),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const refreshSession = useCallback(() => {
    setSession(readSession());
  }, []);

  const login = useCallback(
    async (credentials) => {
      const res = await authService.login(credentials);
      if (res.data?.success) {
        refreshSession();
      }
      return res;
    },
    [refreshSession]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoggedIn: Boolean(session),
      role: session?.role ?? null,
      username: session?.username ?? null,
      orgName: session?.orgName ?? null,
      login,
      logout,
      refreshSession,
    }),
    [session, login, logout, refreshSession]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
