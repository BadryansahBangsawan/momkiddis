import { Button } from "@momkiddis/ui/components/button";
import { X } from "lucide-react";

interface BulkAction {
	label: string;
	action: string;
	variant?: "default" | "destructive" | "outline";
}

interface AdminBulkToolbarProps {
	selectedCount: number;
	actions: BulkAction[];
	onAction: (action: string) => void;
	onClear: () => void;
}

export function AdminBulkToolbar({ selectedCount, actions, onAction, onClear }: AdminBulkToolbarProps) {
	if (selectedCount === 0) return null;

	return (
		<div className="bg-primary text-primary-foreground flex items-center gap-3 rounded-lg px-4 py-2">
			<span className="text-sm font-medium">{selectedCount} item dipilih</span>
			<div className="flex gap-2">
				{actions.map((action) => (
					<Button
						key={action.action}
						size="sm"
						variant={action.variant === "destructive" ? "destructive" : "secondary"}
						onClick={() => onAction(action.action)}
					>
						{action.label}
					</Button>
				))}
			</div>
			<Button size="sm" variant="ghost" onClick={onClear} className="ml-auto">
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
