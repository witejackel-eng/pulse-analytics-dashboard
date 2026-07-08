"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Copy, Trash2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRelativeTime } from "@/lib/utils";

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
}

function randomKeySuffix() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function ApiKeysManager({ initial }: { initial: ApiKeyRow[] }) {
  const [keys, setKeys] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [newKey, setNewKey] = React.useState<string | null>(null);

  function createKey() {
    if (!name.trim()) return;
    const fullKey = `pk_live_${randomKeySuffix()}`;
    setKeys((prev) => [
      { id: `key_${Date.now()}`, name, keyPrefix: fullKey.slice(0, 12), scopes: ["read:metrics"], createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setNewKey(fullKey);
    setName("");
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API key revoked");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-tertiary">{keys.length} active keys</p>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setNewKey(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="primary" size="sm">
              <Plus className="size-3.5" />
              New API key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Your new API key</DialogTitle>
                  <DialogDescription>Copy this key now — you won&apos;t be able to see it again.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 rounded-md border border-border-default bg-bg-surface-2 px-3 py-2">
                  <code className="flex-1 truncate font-mono text-[12px] text-text-primary">{newKey}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy API key"
                    onClick={() => {
                      navigator.clipboard.writeText(newKey);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API key</DialogTitle>
                  <DialogDescription>Scoped to read-only metrics access by default.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="key-name">Key name</Label>
                  <Input id="key-name" placeholder="e.g. Staging integration" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button variant="primary" onClick={createKey} disabled={!name.trim()}>
                    Generate key
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Scopes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-20 text-center text-text-tertiary">
                No API keys yet.
              </TableCell>
            </TableRow>
          ) : (
            keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="flex items-center gap-2 text-text-primary">
                  <KeyRound className="size-3.5 text-text-tertiary" />
                  {key.name}
                </TableCell>
                <TableCell className="mono-nums text-text-tertiary">{key.keyPrefix}••••••••</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {key.scopes.map((scope) => (
                      <Badge key={scope} variant="outline">{scope}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-text-tertiary">{formatRelativeTime(key.createdAt)}</TableCell>
                <TableCell className="text-text-tertiary">{key.lastUsedAt ? formatRelativeTime(key.lastUsedAt) : "Never"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" aria-label="Delete API key" onClick={() => revokeKey(key.id)}>
                    <Trash2 className="size-3.5 text-accent-red" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
