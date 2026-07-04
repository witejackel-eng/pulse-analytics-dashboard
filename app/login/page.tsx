import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in — Pulse" };

export default function LoginPage() {
  return (
    <AuthShell title="Sign in to Pulse" subtitle="Welcome back. Enter your details to access your workspace.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
