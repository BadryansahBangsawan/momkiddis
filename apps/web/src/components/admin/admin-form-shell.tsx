import { Button } from "@momkiddis/ui/components/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface AdminFormShellProps {
	title: string;
	isLoading?: boolean;
	isSaving?: boolean;
	onSave: () => void;
	onCancel: () => void;
	children: React.ReactNode;
}

export function AdminFormShell({ title, isLoading, isSaving, onSave, onCancel, children }: AdminFormShellProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3">
					<div className="bg-muted h-9 w-9 animate-pulse rounded" />
					<div className="bg-muted h-6 w-48 animate-pulse rounded" />
				</div>
				<div className="bg-muted h-64 w-full animate-pulse rounded-lg" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" onClick={onCancel} disabled={isSaving}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h2 className="text-lg font-semibold">{title}</h2>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={onCancel} disabled={isSaving}>
						Batal
					</Button>
					<Button onClick={onSave} disabled={isSaving}>
						{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Simpan
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col gap-6">{children}</div>
		</div>
	);
}
