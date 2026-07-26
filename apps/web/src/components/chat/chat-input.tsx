import { useRef, type KeyboardEvent } from "react";
import { Button } from "@momkiddis/ui/components/button";
import { Send } from "lucide-react";

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const handleSend = () => {
		const value = inputRef.current?.value.trim();
		if (!value || disabled) return;
		onSend(value);
		if (inputRef.current) inputRef.current.value = "";
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex items-end gap-2 border-t border-border bg-background p-3">
			<textarea
				ref={inputRef}
				placeholder="Tanyakan tentang program kami..."
				rows={1}
				disabled={disabled}
				onKeyDown={handleKeyDown}
				className="flex-1 resize-none rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
			/>
			<Button
				size="icon"
				onClick={handleSend}
				disabled={disabled}
				className="size-9 shrink-0 rounded-lg"
			>
				<Send className="size-4" />
			</Button>
		</div>
	);
}
