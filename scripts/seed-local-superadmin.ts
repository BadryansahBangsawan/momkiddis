/**
 * Insert superadmin via Miniflare D1 API (same path as migrations).
 * This ensures the dev server sees the data regardless of in-memory caching.
 *
 * Run: bun scripts/seed-local-superadmin.ts
 */
import { randomBytes, scrypt } from "node:crypto";
import * as mf from "miniflare";
import path from "node:path";

// Same database ID as stored in packages/infra/.alchemy/momkiddis/bbbadry/database.json
const DATABASE_ID = "momkiddis-database-bbbadry";

// Workspace root = /Users/bbbadry/Downloads/momkiddis
const WORKSPACE_ROOT = new URL("..", import.meta.url).pathname;
const PERSIST_ROOT = path.join(WORKSPACE_ROOT, ".alchemy", "miniflare", "v3");

const EMAIL = "badryansah99@gmail.com";
const PASSWORD = "Manujujaya99";
const NAME = "Badryansah";

async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const key = await new Promise<Buffer>((resolve, reject) => {
		scrypt(
			password.normalize("NFKC"),
			salt,
			64,
			{ N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
			(err, key) => (err ? reject(err) : resolve(key)),
		);
	});
	return `${salt}:${key.toString("hex")}`;
}

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
   Password : ${PASSWORD}
   Role     : superadmin
   User ID  : ${userId}

Pastikan dev server di-restart, lalu login di: http://localhost:3001/admin/login
`);
