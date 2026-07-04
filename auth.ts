import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS } from "@/lib/data/demo-users";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser?.password) {
            const valid = await bcrypt.compare(password, dbUser.password);
            if (valid) {
              return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                organizationId: dbUser.organizationId ?? undefined,
              };
            }
            return null;
          }
        } catch {
          // No live database connection available — fall back to demo accounts.
        }

        const demoUser = DEMO_USERS.find((u) => u.email === email);
        if (demoUser && demoUser.password === password) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
          };
        }
        return null;
      },
    }),
  ],
});
