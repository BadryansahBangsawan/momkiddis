/**
 * Shared password hashing helper for one-off admin-provisioning scripts
 * (create-superadmin.ts, seed-local-superadmin.ts).
 *
 * This intentionally mirrors better-auth's default scrypt-based hashing
 * (@better-auth/utils/password) so that credentials written directly via
 * wrangler/Miniflare D1 can be verified by better-auth's normal sign-in flow.
 * It is kept in ONE place so the two parameters (N, r, p, keylen) can't
 * silently drift apart between scripts and stop matching what better-auth
 * itself verifies against at login time.
 */
import { randomBytes, scrypt } from "node:crypto";

const SCRYPT_PARAMS = { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 } as const;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const key = await new Promise<Buffer>((resolve, reject) => {
		scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, SCRYPT_PARAMS, (err, derivedKey) =>
			err ? reject(err) : resolve(derivedKey),
		);
	});
	return `${salt}:${key.toString("hex")}`;
}
