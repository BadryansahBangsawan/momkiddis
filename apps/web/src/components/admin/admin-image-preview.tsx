import { ImageIcon } from "lucide-react";

interface AdminImagePreviewProps {
	src?: string | null;
	alt?: string;
	size?: number;
}

export function AdminImagePreview({ src, alt = "preview", size = 32 }: AdminImagePreviewProps) {
	if (!src) {
		return (
			<div
				className="bg-muted flex items-center justify-center rounded"
				style={{ width: size, height: size }}
			>
				<ImageIcon className="text-muted-foreground h-4 w-4" />
			</div>
		);
	}
	return (
		<img
			src={src}
			alt={alt}
			className="rounded object-cover"
			style={{ width: size, height: size }}
			loading="lazy"
		/>
	);
}
