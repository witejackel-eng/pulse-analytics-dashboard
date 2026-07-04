"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/settings/settings-section";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email address"),
  title: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({ defaultValues }: { defaultValues: FormValues }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const name = watch("name");
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function onSubmit() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Profile updated");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SettingsSection
        title="Profile"
        description="Update your personal information and how it appears across Pulse."
        footer={
          <Button type="submit" variant="primary" disabled={isSaving || !isDirty}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <Avatar className="size-14 border border-border-default">
            <AvatarFallback className="text-[16px]">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <Button type="button" variant="secondary" size="sm" onClick={() => toast.info("Avatar upload isn't wired up in this demo")}>
              Upload photo
            </Button>
            <p className="mt-1.5 text-[11px] text-text-tertiary">JPG or PNG, up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-[12px] text-accent-red">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" {...register("title")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-[12px] text-accent-red">{errors.email.message}</p>}
        </div>
      </SettingsSection>
    </form>
  );
}
