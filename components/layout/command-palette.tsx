"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, FileBarChart, LogOut, CreditCard, KeyRound } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { signOut } from "next-auth/react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border-default bg-bg-elevated shadow-2xl"
      shouldFilter
    >
      <div className="flex items-center gap-2 border-b border-border-subtle px-3.5">
        <Search className="size-4 text-text-tertiary" />
        <Command.Input
          placeholder="Search pages, customers, reports, commands…"
          className="h-12 flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
        />
        <kbd className="rounded border border-border-default px-1.5 py-0.5 text-[10px] text-text-disabled">
          ESC
        </kbd>
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-[13px] text-text-tertiary">
          No results found.
        </Command.Empty>

        <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-text-tertiary">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Command.Item
                key={item.href}
                value={item.title}
                onSelect={() => go(item.href)}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-secondary data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-primary"
              >
                <Icon className="size-4 text-text-tertiary" />
                {item.title}
                <span className="ml-auto text-[11px] text-text-disabled">{item.description}</span>
              </Command.Item>
            );
          })}
        </Command.Group>

        <Command.Separator className="my-1.5 h-px bg-border-subtle" />

        <Command.Group heading="Quick actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-text-tertiary">
          <Command.Item
            value="New report"
            onSelect={() => go("/dashboard/reports")}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-secondary data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-primary"
          >
            <FileBarChart className="size-4 text-text-tertiary" />
            Create a new report
          </Command.Item>
          <Command.Item
            value="API keys"
            onSelect={() => go("/dashboard/settings/api-keys")}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-secondary data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-primary"
          >
            <KeyRound className="size-4 text-text-tertiary" />
            Manage API keys
          </Command.Item>
          <Command.Item
            value="Billing"
            onSelect={() => go("/dashboard/settings/billing")}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-secondary data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-primary"
          >
            <CreditCard className="size-4 text-text-tertiary" />
            View billing
          </Command.Item>
          <Command.Item
            value="Sign out logout"
            onSelect={() => signOut({ callbackUrl: "/login" })}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-accent-red data-[selected=true]:bg-accent-red-dim"
          >
            <LogOut className="size-4" />
            Sign out
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
