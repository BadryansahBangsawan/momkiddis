import { createDb } from "@momkiddis/db";
import * as schema from "@momkiddis/db/schema/auth";
import { env } from "@momkiddis/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

interface CreateAuthOptions {
  allowSignUp?: boolean;
}

// better-auth's generic session/user types don't automatically pick up the
// `role`/`isActive` additionalFields declared below, so callers that need to
// read them (e.g. packages/api/src/index.ts's auth middlewares) previously
// fell back to ad-hoc `as { role?: string }`-style casts, duplicated at each
// call site and silently dropping isActive's type entirely. Centralize the
// real shape here instead, matching packages/db/src/schema/auth.ts exactly
// (including the same role enum enforced there by a CHECK constraint).
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  isActive: boolean;
};

export function createAuth(options: CreateAuthOptions = {}) {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
      disableSignUp: !options.allowSignUp,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    // Better Auth's rate limiter defaults to in-memory storage, which does not
    // survive across Cloudflare Workers isolates — on Workers that makes the
    // built-in brute-force protection on /sign-in, /sign-up, etc. unreliable
    // (each isolate gets its own empty counter). Persist counters in D1 via
    // the same drizzle adapter used for everything else instead.
    rateLimit: {
      enabled: true,
      storage: "database",
    },
    plugins: [tanstackStartCookies()],
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          required: false,
        },
        isActive: {
          type: "boolean",
          defaultValue: true,
          required: false,
        },
      },
    },
  });
}
