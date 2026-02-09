"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    const success = await login(username, password);
    if (success) {
      toast.success("Welcome back to Equibrain!");
      router.push("/dashboard");
    } else {
      toast.error(useAuthStore.getState().error || "Login failed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] items-center justify-center p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#2563EB] rounded-3xl flex items-center justify-center text-white font-bold text-5xl mb-6 shadow-2xl shadow-blue-500/20">
            EB
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">EquiBrain</h1>
          <p className="text-gray-400 text-lg">The Future of Intelligent Trading</p>
        </div>
      </div>

      {/* Right Side - White */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Please enter your credentials to access your account</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="h-12 bg-gray-50 border-gray-200 focus:border-[#2563EB] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-[#2563EB] focus:bg-white pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <div className="flex items-center pt-1">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-lg shadow-[#2563EB]/20 active:scale-[0.99] transition-all text-base disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
