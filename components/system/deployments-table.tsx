import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { DeploymentStatus } from "@/lib/data/system";

interface DeploymentRow {
  id: string;
  service: string;
  version: string;
  status: DeploymentStatus;
  author: string;
  commitSha: string;
  durationSec: number;
  createdAt: string;
}

const STATUS_VARIANT: Record<DeploymentStatus, "emerald" | "red" | "amber" | "blue"> = {
  SUCCESS: "emerald",
  FAILED: "red",
  ROLLED_BACK: "amber",
  IN_PROGRESS: "blue",
};

export function DeploymentsTable({ deployments }: { deployments: DeploymentRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Commit</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Deployed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.slice(0, 12).map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-mono text-text-primary">{d.service}</TableCell>
            <TableCell className="mono-nums">{d.version}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[d.status]}>{d.status.replace("_", " ").toLowerCase()}</Badge>
            </TableCell>
            <TableCell>{d.author}</TableCell>
            <TableCell className="mono-nums text-text-tertiary">{d.commitSha}</TableCell>
            <TableCell className="tabular-nums">{d.durationSec}s</TableCell>
            <TableCell className="text-text-tertiary">{formatRelativeTime(d.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
