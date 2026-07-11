/**
 * Script: create-superadmin.ts
 * Creates the superadmin account in Cloudflare D1 (remote).
 *
 * Required env:
 * - SUPERADMIN_EMAIL
 * - SUPERADMIN_PASSWORD
 * - SUPERADMIN_NAME
 * - CLOUDFLARE_ACCOUNT_ID
 * - D1_DATABASE_NAME
 *
 * Run: bun scripts/create-superadmin.ts
 */

import { execFileSync } from "node:child_process";
import { randomBytes, scrypt } from "node:crypto";
import { unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function requireEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env: ${name}`);
	}
	return value;
}

function sqlString(value: string) {
	return `'${value.replaceAll("'", "''")}'`;
}

const EMAIL = requireEnv("SUPERADMIN_EMAIL");
const PASSWORD = requireEnv("SUPERADMIN_PASSWORD");
const NAME = requireEnv("SUPERADMIN_NAME");
const ACCOUNT_ID = requireEnv("CLOUDFLARE_ACCOUNT_ID");
const DB_NAME = requireEnv("D1_DATABASE_NAME");
const WEB_DIR = new URL("../apps/web", import.meta.url).pathname;

// Generate scrypt hash — same algorithm as @better-auth/utils/password
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

function d1(sql: string) {
	const tmpFile = join(tmpdir(), `d1-${Date.now()}.sql`);
	writeFileSync(tmpFile, sql);
	try {
		const result = execFileSync(
			"bunx",
			["wrangler", "d1", "execute", DB_NAME, "--remote", `--file=${tmpFile}`],
			{
				cwd: WEB_DIR,
				encoding: "utf8",
				env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID },
				stdio: ["ignore", "pipe", "pipe"],
			},
		);
		console.log(result);
	} finally {
		try { unlinkSync(tmpFile); } catch {}
	}
}

const userId = `sa_${randomBytes(8).toString("hex")}`;
const accountId = `acc_${randomBytes(8).toString("hex")}`;
const now = Date.now();
const emailSql = sqlString(EMAIL);
const nameSql = sqlString(NAME);

console.log("🔐 Hashing password...");
const hash = await hashPassword(PASSWORD);
console.log("✅ Hash generated\n");

// 1. Clean slate — remove existing user
console.log("🧹 Removing existing account if any...");
d1(`
DELETE FROM account WHERE user_id IN (SELECT id FROM user WHERE email = ${emailSql});
DELETE FROM session WHERE user_id IN (SELECT id FROM user WHERE email = ${emailSql});
DELETE FROM user WHERE email = ${emailSql};
`);

// 2. Insert superadmin user
console.log("👤 Creating superadmin user...");
d1(`
INSERT INTO user (id, name, email, email_verified, role, is_active, created_at, updated_at)
VALUES (${sqlString(userId)}, ${nameSql}, ${emailSql}, 1, 'superadmin', 1, ${now}, ${now});
`);

// 3. Insert account credentials
console.log("🔑 Creating account credentials...");
d1(`
INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES (${sqlString(accountId)}, ${emailSql}, 'credential', ${sqlString(userId)}, ${sqlString(hash)}, ${now}, ${now});
`);

// 4. Verify
console.log("✅ Verifying...");
d1(`
SELECT u.id, u.email, u.name, u.role, u.is_active, a.provider_id
FROM user u
JOIN account a ON a.user_id = u.id
WHERE u.email = ${emailSql};
`);

console.log(`
🎉 Superadmin berhasil dibuat!
   Email    : ${EMAIL}
   Role     : superadmin
   User ID  : ${userId}

Login di: /admin/login
`);
