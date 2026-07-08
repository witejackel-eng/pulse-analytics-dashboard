import { CreditCard, Download } from "lucide-react";
import { SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const INVOICES = [
  { id: "INV-2026-0006", date: "Jun 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "INV-2026-0005", date: "May 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "INV-2026-0004", date: "Apr 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "INV-2026-0003", date: "Mar 1, 2026", amount: "$2,100.00", status: "Paid" },
  { id: "INV-2026-0002", date: "Feb 1, 2026", amount: "$2,100.00", status: "Paid" },
];

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <SettingsSection title="Plan &amp; usage" description="You're on the Enterprise plan, billed annually.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-text-primary">Enterprise</p>
            <p className="text-[12px] text-text-tertiary">$28,800 / year · renews Jan 1, 2027</p>
          </div>
          <Badge variant="blue">Active</Badge>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px] text-text-tertiary">
            <span>Monthly active users</span>
            <span className="tabular-nums text-text-secondary">8,420 / 10,000</span>
          </div>
          <Progress value={84.2} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px] text-text-tertiary">
            <span>API requests this month</span>
            <span className="tabular-nums text-text-secondary">2.1M / 5M</span>
          </div>
          <Progress value={42} />
        </div>
      </SettingsSection>

      <SettingsSection title="Payment method" description="Used for your annual subscription.">
        <div className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface-2 px-4 py-3">
          <CreditCard className="size-5 text-text-tertiary" />
          <div className="flex-1">
            <p className="text-[13px] text-text-primary">Visa ending in 4242</p>
            <p className="text-[12px] text-text-tertiary">Expires 08/2028</p>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Invoice history" description="Download past invoices for your records.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-text-primary">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="tabular-nums">{invoice.amount}</TableCell>
                <TableCell><Badge variant="emerald">{invoice.status}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" aria-label="Download invoice">
                    <Download className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsSection>
    </div>
  );
}
