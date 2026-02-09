"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    toast.success("Welcome back to Equibrain!");
    router.push("/dashboard");
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
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
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

            <div className="flex items-center pt-1">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-lg shadow-[#2563EB]/20 active:scale-[0.99] transition-all text-base"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
