import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { D1Database } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

// Alchemy scopes all resource state under a "stage" (`.alchemy/<stage>/...`),
// read automatically from `--stage <name>` or the ALCHEMY_STAGE env var, and
// otherwise defaults to the current POSIX username — handy for per-developer
// local stages, but dangerous in CI: a runner that forgets to pass a stage
// would silently deploy/destroy resources under a throwaway runner-username
// stage instead of the intended one. Fail loudly in that specific case
// instead of local dev, where the username default is fine and expected.
if (process.env.CI && !process.env.ALCHEMY_STAGE) {
  throw new Error(
    "ALCHEMY_STAGE must be set explicitly when deploying from CI (e.g. ALCHEMY_STAGE=production) " +
      "to avoid silently targeting a runner-username-scoped stage.",
  );
}

const app = await alchemy("momkiddis");

const db = await D1Database("database", {
  migrationsDir: "../../packages/db/src/migrations",
});

export const web = await TanStackStart("web", {
  cwd: "../../apps/web",
  bindings: {
    DB: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
