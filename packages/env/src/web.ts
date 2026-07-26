import { createEnv } from "@t3-oss/env-core";

// This package doesn't depend on `vite`, so `import.meta.env` has no ambient
// type here (unlike inside apps/web, which gets it from vite/client via its
// own tsconfig) — narrow the cast to just the shape we need instead of `any`.
type ViteImportMeta = { env: Record<string, string | boolean | undefined> };

// NOTE: no code in this repo imports "@momkiddis/env/web" yet (verified via
// repo-wide search during the 2026-07-26 audit) — `client` is intentionally
// empty because there are no VITE_-prefixed vars to validate. Add fields
// here as soon as the app needs any client-exposed env var, rather than
// reading import.meta.env directly elsewhere.
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: (import.meta as unknown as ViteImportMeta).env,
  emptyStringAsUndefined: true,
});
