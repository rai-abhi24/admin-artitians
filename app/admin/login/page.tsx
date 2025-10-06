"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/services/auth";

const DEFAULT_REDIRECT = "/admin/dashboard";

const Login = () => {
  const router = useRouter();
  const search = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await login(email, password);

      if (res.success) {
        const next = search.get("next") || DEFAULT_REDIRECT;
        router.replace(next);
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8 flex-grow flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="text-center mb-6">
          <Image src="/dark-logo.webp" alt="Artitians" width={250} height={250} priority />
        </div>

        {/* Login Card */}
        <Card className="shadow-lg w-full" data-testid="card-login">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center" data-testid="heading-login">
              Sign In
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access the panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="py-6"
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="py-6"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex justify-end">
                  <a className="text-sm text-primary hover:underline cursor-pointer" href="/admin/forgot-password">Forgot password?</a>
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-red-600 text-center text-sm">{error}</p>}

              {/* Submit */}
              <Button type="submit" className="w-full h-12 mt-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : <><LogIn className="h-5 w-5 mr-2" />Sign In</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground w-full py-4">
        © {new Date().getFullYear()} Artitians. All rights reserved.
      </div>
    </div>
  );
}

import { Suspense } from "react";

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 animate-pulse">
        <div className="h-24 bg-muted rounded-lg"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
        <div className="mt-20 h-10 bg-muted rounded-lg"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <Login />
    </Suspense>
  );
}