import { create } from "zustand";
import { AuthAPI, LoginResponse } from "@/lib/api/auth";

interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  name: string;
  initials: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
}

function buildUser(data: LoginResponse): AuthUser {
  const name = data.username.charAt(0).toUpperCase() + data.username.slice(1);
  const initials = name.substring(0, 2).toUpperCase();
  return {
    user_id: data.user_id,
    username: data.username,
    email: data.email,
    name,
    initials,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthAPI.login({ username, password });
      const user = buildUser(data);

      if (typeof window !== "undefined") {
        localStorage.setItem("equibrain_user", JSON.stringify(user));
      }

      set({ isAuthenticated: true, user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Login failed" });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("equibrain_user");
    }
    set({ isAuthenticated: false, user: null, error: null });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("equibrain_user");
      if (stored) {
        try {
          const user = JSON.parse(stored) as AuthUser;
          set({ isAuthenticated: true, user });
        } catch {
          localStorage.removeItem("equibrain_user");
        }
      }
    }
  },
}));
