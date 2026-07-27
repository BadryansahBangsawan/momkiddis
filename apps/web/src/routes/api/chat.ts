import { createFileRoute } from "@tanstack/react-router";
import { buildSystemPrompt, chatToolsOpenAI } from "@/lib/chat-system-prompt";
import { env } from "@momkiddis/env/server";
import { z } from "zod";

const API_URL = "https://9router.badry.engineer/v1/chat/completions";
const MODEL = "momkiddis";
const MAX_BODY_BYTES = 16 * 1024;
const CHAT_TIMEOUT_MS = 30_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const chatRequestSchema = z.object({
	messages: z.array(
		z.object({
			role: z.enum(["user", "assistant"]),
			content: z.string().min(1).max(1000),
		}),
	).min(1).max(12),
});

type ChatRequest = z.infer<typeof chatRequestSchema>;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
	return request.headers.get("cf-connecting-ip")
		?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
		?? "anonymous";
}

function isRateLimited(key: string) {
	const now = Date.now();
	const bucket = rateLimitBuckets.get(key);
	if (!bucket || bucket.resetAt <= now) {
		rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}
	bucket.count += 1;
	return bucket.count > RATE_LIMIT_MAX;
}

async function handleChat({ request }: { request: Request }) {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	const contentLength = Number(request.headers.get("content-length") ?? "0");
	if (contentLength > MAX_BODY_BYTES) {
		return new Response("Request too large", { status: 413 });
	}

	const clientKey = getClientKey(request);
	if (isRateLimited(clientKey)) {
		return new Response("Too many requests", { status: 429 });
	}

	let body: ChatRequest;
	try {
		body = chatRequestSchema.parse(await request.json());
	} catch {
		return new Response("Invalid chat payload", { status: 400 });
	}

	const apiKey = (env.AI_API_KEY as string | undefined) ?? process.env.AI_API_KEY;
	if (!apiKey) {
		return new Response("AI service not configured", { status: 503 });
	}

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				const res = await fetch(API_URL, {
					method: "POST",
					signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
					headers: {
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: MODEL,
						max_tokens: 1024,
						stream: true,
						messages: [
							{ role: "system", content: buildSystemPrompt() },
							...body.messages.map((m) => ({
								role: m.role,
								content: m.content,
							})),
						],
						tools: chatToolsOpenAI,
						tool_choice: "auto",
					}),
				});

				if (!res.ok) {
					const errText = await res.text();
					console.error("[chat] API error:", res.status, errText);
					throw new Error("AI service temporarily unavailable");
				}

				const reader = res.body?.getReader();
				if (!reader) throw new Error("No response body");

				const decoder = new TextDecoder();
				let buffer = "";
				let currentToolName = "";
				let currentToolJson = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";

					for (const line of lines) {
						if (!line.startsWith("data: ")) continue;
						const data = line.slice(6).trim();
						if (data === "[DONE]") {
							if (currentToolName && currentToolJson) {
								try {
									const parsed = JSON.parse(currentToolJson);
									controller.enqueue(
										encoder.encode(
											`data: ${JSON.stringify({ type: "tool_use", name: currentToolName, input: parsed })}\n\n`,
										),
									);
								} catch {
									// invalid JSON
								}
							}
							controller.enqueue(
								encoder.encode(
									`data: ${JSON.stringify({ type: "done" })}\n\n`,
								),
							);
							continue;
						}

						try {
							const chunk = JSON.parse(data);
							const delta = chunk.choices?.[0]?.delta;
							if (!delta) continue;

							if (delta.content) {
								controller.enqueue(
									encoder.encode(
										`data: ${JSON.stringify({ type: "text", content: delta.content })}\n\n`,
									),
								);
							}

							if (delta.tool_calls) {
								for (const tc of delta.tool_calls) {
									if (tc.function?.name) {
										if (currentToolName && currentToolJson) {
											try {
												const parsed = JSON.parse(currentToolJson);
												controller.enqueue(
													encoder.encode(
														`data: ${JSON.stringify({ type: "tool_use", name: currentToolName, input: parsed })}\n\n`,
													),
												);
											} catch {
												// invalid JSON
											}
										}
										currentToolName = tc.function.name;
										currentToolJson = tc.function.arguments ?? "";
									} else if (tc.function?.arguments) {
										currentToolJson += tc.function.arguments;
									}
								}
							}

							if (chunk.choices?.[0]?.finish_reason === "tool_calls") {
								if (currentToolName && currentToolJson) {
									try {
										const parsed = JSON.parse(currentToolJson);
										controller.enqueue(
											encoder.encode(
												`data: ${JSON.stringify({ type: "tool_use", name: currentToolName, input: parsed })}\n\n`,
											),
										);
									} catch {
										// invalid JSON
									}
									currentToolName = "";
									currentToolJson = "";
								}
							}
						} catch {
							// skip malformed chunk
						}
					}
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Unknown error";
				controller.enqueue(
					encoder.encode(
						`data: ${JSON.stringify({ type: "error", content: message })}\n\n`,
					),
				);
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: handleChat,
		},
	},
});
