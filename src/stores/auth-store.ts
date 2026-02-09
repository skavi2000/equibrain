import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; initials: string; balance: string } | null;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: () =>
    set({
      isAuthenticated: true,
      user: {
        name: "Gihan D.",
        initials: "GD",
        balance: "LKR 2,847,350.00",
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
