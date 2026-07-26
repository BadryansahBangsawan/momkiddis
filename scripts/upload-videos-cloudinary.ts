#!/usr/bin/env bun
/**
 * One-time script: Upload video files from public/vidio/ to Cloudinary
 *
 * Required env:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 *
 * Run: bun scripts/upload-videos-cloudinary.ts
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function requireEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env: ${name}`);
	}
	return value;
}

const CLOUD_NAME = requireEnv("CLOUDINARY_CLOUD_NAME");
const API_KEY = requireEnv("CLOUDINARY_API_KEY");
const API_SECRET = requireEnv("CLOUDINARY_API_SECRET");

const VIDEOS_DIR = join(import.meta.dir, "../apps/web/public/vidio");

const videos = ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"];

function sign(params: Record<string, string>): string {
	// Only sign params that are NOT: file, api_key, resource_type, api_secret
	const sorted = Object.keys(params)
		.sort()
		.map((k) => `${k}=${params[k]}`)
		.join("&");
	return createHash("sha1")
		.update(sorted + API_SECRET)
		.digest("hex");
}

// Returns true on success so the caller can report a pass/fail summary
// instead of letting one bad file (missing, unreadable, network error, etc.)
// throw and silently skip every remaining video.
async function uploadVideo(filename: string): Promise<boolean> {
	const publicId = `momkiddis/vidio/${filename.replace(".mp4", "")}`;
	const timestamp = String(Math.floor(Date.now() / 1000));

	// Only include params that go into the signature (no resource_type, api_key, file)
	const signParams: Record<string, string> = {
		public_id: publicId,
		timestamp,
	};

	const signature = sign(signParams);

	const filePath = join(VIDEOS_DIR, filename);

	try {
		const fileBuffer = readFileSync(filePath);
		const blob = new Blob([fileBuffer], { type: "video/mp4" });

		const form = new FormData();
		form.append("file", blob, filename);
		form.append("public_id", publicId);
		form.append("timestamp", timestamp);
		form.append("api_key", API_KEY);
		form.append("signature", signature);
		form.append("resource_type", "video");

		console.log(`⬆️  Uploading ${filename} → ${publicId} ...`);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
			{ method: "POST", body: form },
		);

		const data = (await res.json()) as { secure_url?: string; error?: { message: string } };

		if (!res.ok || data.error) {
			console.error(`❌ ${filename}: ${data.error?.message ?? res.statusText}`);
			return false;
		}

		console.log(`✅ ${filename}: ${data.secure_url}`);
		return true;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`❌ ${filename}: ${message}`);
		return false;
	}
}

console.log("🎬 Starting Cloudinary video upload...\n");

const results = new Map<string, boolean>();
for (const video of videos) {
	results.set(video, await uploadVideo(video));
}

const failed = [...results].filter(([, ok]) => !ok).map(([name]) => name);

console.log("\n✨ Done!");
console.log(`   ${results.size - failed.length}/${results.size} uploaded successfully.`);
if (failed.length > 0) {
	console.log(`   Failed: ${failed.join(", ")}`);
}
console.log(`🔗 Base URL: https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto/momkiddis/vidio/`);

// Exit non-zero if anything failed, so this is CI/automation-friendly.
if (failed.length > 0) {
	process.exit(1);
}
