import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { Skeleton } from "@momkiddis/ui/components/skeleton";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<LayoutDashboard className="text-muted-foreground h-5 w-5" />
				<h2 className="text-lg font-semibold">Dashboard</h2>
			</div>

			{/* Placeholder — akan diganti Phase 8 dengan stat cards + recent activity */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full rounded-lg" />
				))}
			</div>

			<div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
				Dashboard stats akan tampil setelah Phase 8 selesai.
			</div>
		</div>
	);
}
