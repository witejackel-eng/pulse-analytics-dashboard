# Deploying Pulse

## 1. Provision a Postgres database

Any managed Postgres works — [Neon](https://neon.tech), [Supabase](https://supabase.com),
[Railway](https://railway.app), or RDS. Copy the connection string; you'll need
the pooled connection URL for `DATABASE_URL`.

## 2. Deploy to Vercel

1. Push this repository to GitHub (already done if you're reading this from
   the deployed repo).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Set the environment variables under **Project Settings → Environment Variables**:

   | Variable                | Required | Notes                                              |
   | ------------------------ | -------- | --------------------------------------------------- |
   | `AUTH_SECRET`             | Yes      | `openssl rand -base64 32`                            |
   | `DATABASE_URL`            | Recommended | Falls back to curated demo data if omitted/unreachable |
   | `GOOGLE_CLIENT_ID`        | Optional | Enables real Google sign-in                          |
   | `GOOGLE_CLIENT_SECRET`    | Optional | Enables real Google sign-in                          |

4. Deploy. Vercel runs `npm run build`, which runs `prisma generate` via the
   `postinstall` script automatically.

## 3. Apply the schema and seed data

Once `DATABASE_URL` points at a real database, run migrations and seed from
your local machine (or a one-off Vercel deployment shell):

```bash
npm run db:push    # or: npx prisma migrate deploy, if you're using migrations
npm run db:seed
```

## 4. Google OAuth setup (optional)

1. Create an OAuth client at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials).
2. Application type: **Web application**.
3. Authorized redirect URI: `https://<your-domain>/api/auth/callback/google`.
4. Copy the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## Notes on the resilience pattern

Pulse's data layer (`server/queries/*.ts`) tries Prisma first and falls back
to curated in-memory data on any error. This means:

- The app is demo-able immediately after deploy, even before you've run
  `db:seed`.
- A transient database outage degrades to read-only demo data instead of a
  broken page — useful in production, essential during this build's own
  development (no live Postgres was available in the build environment).

Once your database is seeded, all reads transparently switch to live data —
no code changes required.
