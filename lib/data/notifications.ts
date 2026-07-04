export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface NotificationRecord {
  id: string;
  level: NotificationLevel;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export function getCuratedNotifications(): NotificationRecord[] {
  const now = Date.now();
  return [
    { id: "n1", level: "WARNING", title: "Error rate spike", body: "ingest-pipeline error rate crossed 2% for 5 minutes.", read: false, createdAt: new Date(now - 12 * 60000).toISOString() },
    { id: "n2", level: "SUCCESS", title: "Monthly report ready", body: "Your June performance report has been generated.", read: false, createdAt: new Date(now - 55 * 60000).toISOString() },
    { id: "n3", level: "ERROR", title: "Payment failed", body: "Redwood Legal's card was declined during renewal.", read: false, createdAt: new Date(now - 3 * 3600000).toISOString() },
    { id: "n4", level: "INFO", title: "New teammate joined", body: "Priya Malhotra joined the Pulse Analytics workspace.", read: true, createdAt: new Date(now - 26 * 3600000).toISOString() },
    { id: "n5", level: "INFO", title: "Dashboard shared", body: "Reese Calloway shared 'Q3 Growth Review' with you.", read: true, createdAt: new Date(now - 30 * 3600000).toISOString() },
  ];
}
