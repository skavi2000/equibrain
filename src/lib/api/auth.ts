const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user_id: number;
  username: string;
  email: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export const AuthAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await fetch(`${API_BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Invalid username or password");
    }

    return res.json();
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await fetch(`${API_BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Registration failed");
    }

    return res.json();
  },
};
