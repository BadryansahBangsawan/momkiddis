import type { LucideIcon } from "lucide-react";
import { Button } from "@momkiddis/ui/components/button";

interface AdminEmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function AdminEmptyState({ icon: Icon, title, description, actionLabel, onAction }: AdminEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			{Icon && (
				<div className="bg-muted mb-4 rounded-full p-4">
					<Icon className="text-muted-foreground h-8 w-8" />
				</div>
			)}
			<p className="mb-1 text-base font-medium">{title}</p>
			{description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}
			{actionLabel && onAction && (
				<Button onClick={onAction} size="sm">
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
