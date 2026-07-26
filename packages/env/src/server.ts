/// <reference types="@cloudflare/workers-types" />
/// <reference path="../env.d.ts" />
// For Cloudflare Workers, env is accessed via cloudflare:workers module
// Types are defined in env.d.ts based on your alchemy.run.ts bindings
import { env as workerEnv } from "cloudflare:workers";

// Bindings that must always be present in a correctly-deployed Worker (kept
// in sync with the `bindings` object in packages/infra/alchemy.run.ts).
// Wrapping access in a Proxy means a missing binding fails immediately, with
// a clear message, the first time it's read — instead of surfacing later as
// an opaque "undefined is not a function"-style error deep inside whatever
// consumed it (e.g. drizzle(env.DB, ...) or a fetch() Authorization header).
const REQUIRED_KEYS = [
  "DB",
  "CORS_ORIGIN",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
] as const;

export const env = new Proxy(workerEnv, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (value == null && (REQUIRED_KEYS as readonly string[]).includes(prop as string)) {
      throw new Error(
        `[@momkiddis/env] Required binding "${String(prop)}" is not set on this Worker. ` +
          `Check the "bindings" block in packages/infra/alchemy.run.ts and your Cloudflare secrets/vars.`,
      );
    }
    return value;
  },
});
