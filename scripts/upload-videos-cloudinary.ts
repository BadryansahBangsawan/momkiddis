#!/usr/bin/env bun
/**
 * One-time script: Upload video files from public/vidio/ to Cloudinary
 * Run: bun scripts/upload-videos-cloudinary.ts
 */

import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CLOUD_NAME = "dapw2uaa9";
const API_KEY = "642524828967722";
const API_SECRET = "G57zlWX4Di1jrkDNPM8AIElm72U";

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

async function uploadVideo(filename: string) {
	const publicId = `momkiddis/vidio/${filename.replace(".mp4", "")}`;
	const timestamp = String(Math.floor(Date.now() / 1000));

	// Only include params that go into the signature (no resource_type, api_key, file)
	const signParams: Record<string, string> = {
		public_id: publicId,
		timestamp,
	};

	const signature = sign(signParams);

	const filePath = join(VIDEOS_DIR, filename);
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
		return;
	}

	console.log(`✅ ${filename}: ${data.secure_url}`);
}

console.log("🎬 Starting Cloudinary video upload...\n");

for (const video of videos) {
	await uploadVideo(video);
}

console.log("\n✨ Done! Videos are now on Cloudinary.");
console.log(`🔗 Base URL: https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto/momkiddis/vidio/`);
