import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { cn } from "@momkiddis/ui/lib/utils";
import {
	ChatMessages,
	type ChatMessage,
	type ToolCall,
} from "./chat-messages";
import { ChatInput } from "./chat-input";

let messageCounter = 0;
function nextId() {
	return `msg-${++messageCounter}`;
}

export function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const sendMessage = useCallback(
		async (text: string) => {
			const userMsg: ChatMessage = {
				id: nextId(),
				role: "user",
				content: text,
			};

			const updatedMessages = [...messages, userMsg];
			setMessages(updatedMessages);
			setIsLoading(true);

			// Prepare history for API
			const apiMessages = updatedMessages.map((m) => ({
				role: m.role,
				content: m.content,
			}));

			const assistantId = nextId();
			let assistantContent = "";
			const toolCalls: ToolCall[] = [];

			try {
				abortRef.current = new AbortController();
				const res = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ messages: apiMessages }),
					signal: abortRef.current.signal,
				});

				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}

				const reader = res.body?.getReader();
				if (!reader) throw new Error("No response body");

				const decoder = new TextDecoder();
				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";

					for (const line of lines) {
						if (!line.startsWith("data: ")) continue;
						const jsonStr = line.slice(6);
						if (!jsonStr) continue;

						try {
							const event = JSON.parse(jsonStr) as {
								type: string;
								content?: string;
								name?: string;
								input?: { slugs: unknown; reason: string };
							};

							if (
								event.type === "text" &&
								event.content
							) {
								assistantContent += event.content;
								setMessages([
									...updatedMessages,
									{
										id: assistantId,
										role: "assistant",
										content: assistantContent,
										toolCalls: toolCalls.length
											? [...toolCalls]
											: undefined,
									},
								]);
							} else if (
								event.type === "tool_use" &&
								event.name === "recommend_program" &&
								event.input
							) {
								toolCalls.push({
									name: event.name,
									input: event.input,
								});
								setMessages([
									...updatedMessages,
									{
										id: assistantId,
										role: "assistant",
										content: assistantContent,
										toolCalls: [...toolCalls],
									},
								]);
							} else if (event.type === "error") {
								assistantContent =
									"Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi admin via WhatsApp.";
								setMessages([
									...updatedMessages,
									{
										id: assistantId,
										role: "assistant",
										content: assistantContent,
									},
								]);
							}
						} catch {
							// skip malformed JSON
						}
					}
				}

				// Ensure final state is set
				if (assistantContent || toolCalls.length) {
					setMessages([
						...updatedMessages,
						{
							id: assistantId,
							role: "assistant",
							content: assistantContent,
							toolCalls: toolCalls.length
								? [...toolCalls]
								: undefined,
						},
					]);
				}
			} catch (err) {
				if (
					err instanceof Error &&
					err.name === "AbortError"
				)
					return;
				setMessages([
					...updatedMessages,
					{
						id: assistantId,
						role: "assistant",
						content:
							"Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi admin via WhatsApp.",
					},
				]);
			} finally {
				setIsLoading(false);
				abortRef.current = null;
			}
		},
		[messages],
	);

	return (
		<>
			{/* Chat Panel */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 350,
							damping: 30,
						}}
						className="fixed bottom-20 right-4 z-50 flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:bottom-24 md:right-6"
					>
						{/* Header */}
						<div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
							<div className="flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
									<Sparkles className="size-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Tanya AI
									</p>
									<p className="text-[10px] text-muted-foreground">
										Asisten Virtual Momkiddis
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<X className="size-4" />
							</button>
						</div>

						{/* Messages */}
						<ChatMessages
							messages={messages}
							isLoading={isLoading}
						/>

						{/* Input */}
						<ChatInput
							onSend={sendMessage}
							disabled={isLoading}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Button */}
			<motion.button
				type="button"
				onClick={() => setIsOpen((v) => !v)}
				className={cn(
					"fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-colors md:bottom-6 md:right-6",
					isOpen
						? "bg-muted text-muted-foreground hover:bg-muted/80"
						: "bg-primary text-primary-foreground hover:bg-primary/90",
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<AnimatePresence mode="wait" initial={false}>
					{isOpen ? (
						<motion.div
							key="close"
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							<X className="size-5" />
						</motion.div>
					) : (
						<motion.div
							key="open"
							initial={{ rotate: 90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							<MessageCircle className="size-5" />
						</motion.div>
					)}
				</AnimatePresence>
				{!isOpen && (
					<span className="text-sm font-semibold">Tanya AI</span>
				)}
			</motion.button>
		</>
	);
}
