/**
 * Insert superadmin via Miniflare D1 API (same path as migrations).
 * This ensures the dev server sees the data regardless of in-memory caching.
 *
 * Required env:
 * - SUPERADMIN_EMAIL
 * - SUPERADMIN_PASSWORD
 * - SUPERADMIN_NAME
 * Optional env:
 * - MINIFLARE_D1_DATABASE_ID (defaults to local alchemy database ID)
 *
 * Run: bun scripts/seed-local-superadmin.ts
 */
import { randomBytes } from "node:crypto";
import * as mf from "miniflare";
import { userInfo } from "node:os";
import path from "node:path";
import { hashPassword } from "./lib/password-hash";

function requireEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env: ${name}`);
	}
	return value;
}

// Alchemy names local D1 databases "<app>-<id>-<stage>", defaulting "stage"
// to the current POSIX username (see packages/infra/alchemy.run.ts and
// `D1Database("database", ...)`). Deriving it the same way here — instead of
// hardcoding one developer's username — means this script works out of the
// box for anyone, while MINIFLARE_D1_DATABASE_ID can still override it
// (e.g. if ALCHEMY_STAGE was set explicitly when the db was created).
const DATABASE_ID = process.env.MINIFLARE_D1_DATABASE_ID ?? `momkiddis-database-${userInfo().username}`;

// Workspace root = repo root (one level up from scripts/)
const WORKSPACE_ROOT = new URL("..", import.meta.url).pathname;
const PERSIST_ROOT = path.join(WORKSPACE_ROOT, ".alchemy", "miniflare", "v3");

const EMAIL = requireEnv("SUPERADMIN_EMAIL");
const PASSWORD = requireEnv("SUPERADMIN_PASSWORD");
const NAME = requireEnv("SUPERADMIN_NAME");

console.log("🔐 Hashing password...");
const hash = await hashPassword(PASSWORD);
console.log("✅ Hash generated\n");

console.log("🚀 Connecting to local Miniflare D1...");
const miniflare = new mf.Miniflare({
	script: "",
	modules: true,
	defaultPersistRoot: PERSIST_ROOT,
	d1Persist: true,
	d1Databases: { DB: DATABASE_ID },
});

await miniflare.ready;
const db = await miniflare.getD1Database("DB");
const session = db.withSession("first-primary");

const userId = `sa_${randomBytes(8).toString("hex")}`;
const accountId = `acc_${randomBytes(8).toString("hex")}`;
const now = Date.now();

console.log("🧹 Removing existing user if any...");
await session.batch([
	session.prepare(
		`DELETE FROM account WHERE user_id IN (SELECT id FROM user WHERE email = ?)`,
	).bind(EMAIL),
	session.prepare(
		`DELETE FROM session WHERE user_id IN (SELECT id FROM user WHERE email = ?)`,
	).bind(EMAIL),
	session.prepare(`DELETE FROM user WHERE email = ?`).bind(EMAIL),
]);

console.log("👤 Creating superadmin user...");
await session
	.prepare(
		`INSERT INTO user (id, name, email, email_verified, role, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 1, 'superadmin', 1, ?, ?)`,
	)
	.bind(userId, NAME, EMAIL, now, now)
	.run();

console.log("🔑 Creating account credentials...");
await session
	.prepare(
		`INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
     VALUES (?, ?, 'credential', ?, ?, ?, ?)`,
	)
	.bind(accountId, EMAIL, userId, hash, now, now)
	.run();

console.log("✅ Verifying...");
const result = await session
	.prepare(`SELECT id, email, name, role, is_active FROM user WHERE email = ?`)
	.bind(EMAIL)
	.first();
console.log(result);

await miniflare.dispose();

console.log(`
🎉 Superadmin local berhasil dibuat!
   Email    : ${EMAIL}
   Role     : superadmin
   User ID  : ${userId}

Pastikan dev server di-restart, lalu login di: http://localhost:3001/admin/login
`);
