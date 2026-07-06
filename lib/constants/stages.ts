export const STAGE_VARIANT: Record<string, "default" | "blue" | "purple" | "amber" | "emerald" | "red"> = {
  LEAD: "default",
  QUALIFIED: "blue",
  PROPOSAL: "purple",
  NEGOTIATION: "amber",
  CLOSED_WON: "emerald",
  CLOSED_LOST: "red",
};

export const STAGE_COLOR: Record<string, string> = {
  LEAD: "bg-text-disabled",
  QUALIFIED: "bg-accent-blue",
  PROPOSAL: "bg-accent-purple",
  NEGOTIATION: "bg-accent-amber",
  CLOSED_WON: "bg-accent-emerald",
  CLOSED_LOST: "bg-accent-red",
};

export const STAGE_ACCENT: Record<string, string> = {
  LEAD: "border-t-text-disabled",
  QUALIFIED: "border-t-accent-blue",
  PROPOSAL: "border-t-accent-purple",
  NEGOTIATION: "border-t-accent-amber",
  CLOSED_WON: "border-t-accent-emerald",
  CLOSED_LOST: "border-t-accent-red",
};