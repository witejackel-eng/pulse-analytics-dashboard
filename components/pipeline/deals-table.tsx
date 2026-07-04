import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STAGES, type DealRecord } from "@/lib/data/pipeline";

const STAGE_VARIANT: Record<string, "default" | "blue" | "purple" | "amber" | "emerald" | "red"> = {
  LEAD: "default",
  QUALIFIED: "blue",
  PROPOSAL: "purple",
  NEGOTIATION: "amber",
  CLOSED_WON: "emerald",
  CLOSED_LOST: "red",
};

const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label]));

export function DealsTable({ deals }: { deals: DealRecord[] }) {
  const sorted = [...deals].sort((a, b) => b.amount - a.amount).slice(0, 15);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Deal</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Probability</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Close date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((deal) => (
          <TableRow key={deal.id}>
            <TableCell className="max-w-56 truncate text-text-primary">{deal.name}</TableCell>
            <TableCell>
              <Badge variant={STAGE_VARIANT[deal.stage]}>{STAGE_LABEL[deal.stage]}</Badge>
            </TableCell>
            <TableCell className="tabular-nums text-text-primary">{formatCurrency(deal.amount)}</TableCell>
            <TableCell className="tabular-nums">{deal.probability}%</TableCell>
            <TableCell>{deal.owner}</TableCell>
            <TableCell className="text-text-tertiary">{formatDate(deal.closeDate, { month: "short", day: "numeric", year: "numeric" })}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
