import { createDb } from "@momkiddis/db";
import * as schema from "@momkiddis/db/schema/auth";
import { env } from "@momkiddis/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

interface CreateAuthOptions {
  allowSignUp?: boolean;
}

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
