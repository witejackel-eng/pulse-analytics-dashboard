export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "ANALYST" | "VIEWER";
  title: string;
  image?: string;
}

// Mirrors prisma/seed.ts — used when no live database connection is available
// so auth still works end-to-end in preview/demo environments.
export const DEMO_USERS: DemoUser[] = [
  { id: "user_admin", name: "Reese Calloway", email: "admin@pulse.io", password: "Password123!", role: "ADMIN", title: "VP of Analytics" },
  { id: "user_analyst", name: "Devon Ashworth", email: "analyst@pulse.io", password: "Password123!", role: "ANALYST", title: "Senior Data Analyst" },
  { id: "user_viewer", name: "Priya Malhotra", email: "viewer@pulse.io", password: "Password123!", role: "VIEWER", title: "Product Manager" },
];
