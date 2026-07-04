"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MockSaveButton({ label = "Save changes", successMessage = "Changes saved" }: { label?: string; successMessage?: string }) {
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      type="button"
      variant="primary"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        setLoading(false);
        toast.success(successMessage);
      }}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  );
}
