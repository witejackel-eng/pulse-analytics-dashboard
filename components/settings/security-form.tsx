"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Laptop, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "@/components/settings/settings-section";
import { StatusDot } from "@/components/ui/badge";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const SESSIONS = [
  { device: "MacBook Pro — Chrome", location: "Delhi, India", icon: Laptop, current: true },
  { device: "iPhone 16 — Safari", location: "Delhi, India", icon: Smartphone, current: false },
];

export function SecurityForm() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    reset();
    toast.success("Password updated");
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SettingsSection
          title="Password"
          description="Change your password. You'll be signed out of other devices."
          footer={
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              Update password
            </Button>
          }
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" {...register("currentPassword")} />
            {errors.currentPassword && <p className="text-[12px] text-accent-red">{errors.currentPassword.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...register("newPassword")} />
              {errors.newPassword && <p className="text-[12px] text-accent-red">{errors.newPassword.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-[12px] text-accent-red">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection title="Two-factor authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-text-primary">Authenticator app</p>
            <p className="text-[12px] text-text-tertiary">{twoFactor ? "Enabled" : "Not enabled"}</p>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={(checked) => {
              setTwoFactor(checked);
              toast.success(checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
            }}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Active sessions" description="Devices currently signed in to your account.">
        <div className="flex flex-col gap-1">
          {SESSIONS.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.device} className="flex items-center gap-3 py-2.5">
                <Icon className="size-4 text-text-tertiary" />
                <div className="flex-1">
                  <p className="text-[13px] text-text-primary">{session.device}</p>
                  <p className="text-[12px] text-text-tertiary">{session.location}</p>
                </div>
                {session.current ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-accent-emerald">
                    <StatusDot variant="emerald" /> This device
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => toast.success("Session revoked")}>
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </SettingsSection>
    </div>
  );
}
