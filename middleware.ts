import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Middleware runs on the Edge runtime, so it must not pull in the full
// NextAuth instance from "@/auth" — that drags in Prisma, bcryptjs, and
// the OAuth/credentials providers, which previously pushed this Edge
// Function past Vercel's 1 MB size limit. `authConfig` has no providers,
// so building the NextAuth instance from it keeps the edge bundle small
// while still decoding the JWT session cookie for the `authorized` check.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/dashboard/:path*"],
};
