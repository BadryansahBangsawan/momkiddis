import { fileURLToPath, URL } from "node:url";

import { config } from "dotenv";

config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
config({ path: fileURLToPath(new URL("../../../apps/web/.env", import.meta.url)) });
config();

const runtimeEnv = typeof process === "undefined" ? {} : process.env;

// Vars that must be non-empty for the app to function, kept in sync with the
// "bindings" block in packages/infra/alchemy.run.ts. This shim only stands
// in for "cloudflare:workers" when no local Alchemy/Wrangler dev session has
// run yet (see apps/web/vite.config.ts) — reading these here silently
// returning `undefined` used to fail deep inside whatever consumed it
// (e.g. drizzle(env.DB, ...)) with a confusing low-level error instead of a
// clear one.
const REQUIRED_STRING_KEYS = ["CORS_ORIGIN", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"] as const;

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (typeof prop !== "string") {
      return undefined;
    }

    // DB is a Cloudflare D1 binding, not a string — this local shim has no
    // way to provide one at all. Fail with a clear, actionable message
    // instead of returning `undefined` and letting `drizzle(env.DB, ...)`
    // blow up with an unrelated-looking error.
    if (prop === "DB") {
      throw new Error(
        "[@momkiddis/env] The DB (D1) binding is not available outside Cloudflare Workers/Alchemy. " +
          "Run `alchemy dev` (or `bun run dev`) so apps/web/.alchemy/local/wrangler.jsonc is generated " +
          "and the real cloudflare:workers module is used instead of this local fallback.",
      );
    }

    const value = runtimeEnv[prop];
    if (!value && (REQUIRED_STRING_KEYS as readonly string[]).includes(prop)) {
      throw new Error(
        `[@momkiddis/env] Required environment variable "${prop}" is not set. ` +
          "Check apps/web/.env (see apps/web/.env.example).",
      );
    }

    return value;
  },
});
