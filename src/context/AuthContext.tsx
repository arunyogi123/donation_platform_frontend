import React, { createContext, useContext, useState, useEffect } from "react";
import { clearTokens, getStoredProfile, getStoredTokens } from "../lib/auth";
import { accountService } from "../services/account";
import { LoginRequest, RegisterRequest, UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() =>
    getStoredProfile(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const tokens = getStoredTokens();
      if (tokens?.access) {
        try {
          const profile = await accountService.getProfile();
          setUser(profile);
        } catch {
          // If profile fetch fails, user might still be logged in locally or need fresh login
          const stored = getStoredProfile();
          if (stored) setUser(stored);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await accountService.login(credentials);
      setUser(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await accountService.register(data);
      // Auto-login or set user profile
      const res = await accountService.login({
        email: data.email,
        password: data.password,
      });
      setUser(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await accountService.getProfile();
      setUser(profile);
    } catch {
      // Keep existing profile
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
