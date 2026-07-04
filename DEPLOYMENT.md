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

   | Variable                | Required at build | Required at runtime | Notes                                              |
   | ------------------------ | ------------------ | -------------------- | --------------------------------------------------- |
   | `AUTH_SECRET`             | No                  | Yes                   | `openssl rand -base64 32` — needed for real sessions; the build succeeds without it but sign-in won't be secure in production |
   | `DATABASE_URL`            | No (a committed placeholder in `.env` covers `prisma generate`) | Recommended | Without a real value, every page falls back to curated demo data instead of erroring |
   | `GOOGLE_CLIENT_ID`        | No                  | Optional              | Enables real Google sign-in                          |
   | `GOOGLE_CLIENT_SECRET`    | No                  | Optional              | Enables real Google sign-in                          |

   `DATABASE_URL` does **not** need to be set for the build itself to succeed —
   see "Prisma + Vercel build failures" below — but it does need to be set (and
   point at a real, migrated database) before the app will show live data
   instead of the seeded demo dataset.

4. Deploy. Vercel runs `npm install` (which runs `prisma generate` via the
   `postinstall` script) and then `npm run build` automatically.

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

## Prisma + Vercel build failures

If a deploy fails during `npm install`/`next build` with:

```
error: Environment variable not found: DATABASE_URL.
  -->  prisma/schema.prisma:7
Validation Error Count: 1
```

it means `DATABASE_URL` wasn't resolvable when `prisma generate` ran (via the
`postinstall` script). Prisma's `generate`/`validate` commands need the env
var to be *present and syntactically valid* — they don't need it to point at
a reachable database — so this fails even before any code that could catch it
at runtime gets a chance to run.

This repository fixes that by committing a non-secret placeholder `DATABASE_URL`
in a root-level `.env` file (safe to commit — it's never used to actually
connect to anything). Both Next.js's and Prisma's env loaders read `.env`
automatically, and a real `DATABASE_URL` set in `.env.local` (local dev) or in
your hosting provider's dashboard (production) always takes precedence over
it, since dotenv never overrides a variable that's already set in
`process.env`. If you still hit this error, check that `.env` exists in the
repo and wasn't accidentally excluded by `.gitignore` — a blanket `.env*`
ignore pattern (the `create-next-app` default) will swallow it.

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
