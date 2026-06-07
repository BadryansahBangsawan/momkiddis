/**
 * Script: create-superadmin.ts
 * Creates the superadmin account in Cloudflare D1 (remote).
 *
 * Run: bun scripts/create-superadmin.ts
 */

import { randomBytes, scrypt } from "node:crypto";
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const EMAIL = "badryansah99@gmail.com";
const PASSWORD = "Manujujaya99";
const NAME = "Badryansah";
const ACCOUNT_ID = "affb450d746e53150028bb763b2f640c";
const DB_NAME = "momkiddis-db";
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
		const result = execSync(
			`CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} bunx wrangler d1 execute ${DB_NAME} --remote --file="${tmpFile}" 2>&1`,
			{ cwd: WEB_DIR, encoding: "utf8" },
		);
		console.log(result);
	} finally {
		try { unlinkSync(tmpFile); } catch {}
	}
}

const userId = `sa_${randomBytes(8).toString("hex")}`;
const accountId = `acc_${randomBytes(8).toString("hex")}`;
const now = Date.now();

console.log("🔐 Hashing password...");
const hash = await hashPassword(PASSWORD);
console.log("✅ Hash generated\n");

// 1. Clean slate — remove existing user
console.log("🧹 Removing existing account if any...");
d1(`
DELETE FROM account WHERE user_id IN (SELECT id FROM user WHERE email = '${EMAIL}');
DELETE FROM session WHERE user_id IN (SELECT id FROM user WHERE email = '${EMAIL}');
DELETE FROM user WHERE email = '${EMAIL}';
`);

// 2. Insert superadmin user
console.log("👤 Creating superadmin user...");
d1(`
INSERT INTO user (id, name, email, email_verified, role, is_active, created_at, updated_at)
VALUES ('${userId}', '${NAME}', '${EMAIL}', 1, 'superadmin', 1, ${now}, ${now});
`);

// 3. Insert account credentials
console.log("🔑 Creating account credentials...");
d1(`
INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES ('${accountId}', '${EMAIL}', 'credential', '${userId}', '${hash}', ${now}, ${now});
`);

// 4. Verify
console.log("✅ Verifying...");
d1(`
SELECT u.id, u.email, u.name, u.role, u.is_active, a.provider_id
FROM user u
JOIN account a ON a.user_id = u.id
WHERE u.email = '${EMAIL}';
`);

console.log(`
🎉 Superadmin berhasil dibuat!
   Email    : ${EMAIL}
   Password : ${PASSWORD}
   Role     : superadmin
   User ID  : ${userId}

Login di: /admin/login
`);
