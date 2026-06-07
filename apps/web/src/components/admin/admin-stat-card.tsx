import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@momkiddis/ui/components/card";

interface AdminStatCardProps {
	icon: LucideIcon;
	label: string;
	value: number;
	sub?: string;
	iconColor?: string;
}

export function AdminStatCard({ icon: Icon, label, value, sub, iconColor = "text-muted-foreground" }: AdminStatCardProps) {
	return (
		<Card>
			<CardContent className="flex items-center gap-4 p-5">
				<div className={`rounded-lg bg-muted p-2 ${iconColor}`}>
					<Icon className="h-5 w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-muted-foreground truncate text-sm">{label}</p>
					<p className="text-2xl font-bold">{value.toLocaleString("id-ID")}</p>
					{sub && <p className="text-muted-foreground text-xs">{sub}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
