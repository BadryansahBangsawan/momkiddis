import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@momkiddis/ui/components/select";
import { Button } from "@momkiddis/ui/components/button";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { Clock, Filter } from "lucide-react";

export const Route = createFileRoute("/admin/activity")({
	beforeLoad: ({ context }) => {
		const ctx = context as { isSuperAdmin?: boolean };
		if (!ctx.isSuperAdmin) throw redirect({ to: "/admin" });
	},
	component: ActivityPage,
});

const ACTION_OPTIONS = [
	{ label: "Semua Aksi", value: "" },
	{ label: "Create", value: "create" },
	{ label: "Update", value: "update" },
	{ label: "Delete", value: "delete" },
];

const ENTITY_OPTIONS = [
	{ label: "Semua Entitas", value: "" },
	{ label: "Testimoni", value: "testimonial" },
	{ label: "Alumni", value: "alumni" },
	{ label: "Galeri", value: "gallery" },
	{ label: "Event", value: "event" },
	{ label: "Resource", value: "resource" },
	{ label: "Promo", value: "promo" },
	{ label: "Pengguna", value: "user" },
	{ label: "Site Config", value: "site_config" },
];

const DAYS_OPTIONS = [
	{ label: "7 Hari Terakhir", value: "7" },
	{ label: "30 Hari Terakhir", value: "30" },
	{ label: "90 Hari Terakhir", value: "90" },
];

const ACTION_COLORS: Record<string, string> = {
	create: "bg-green-500/10 text-green-600",
	update: "bg-blue-500/10 text-blue-600",
	delete: "bg-destructive/10 text-destructive",
};

interface ActivityLog {
	id: string;
	actorId: string;
	actorName: string;
	actorRole: string;
	action: string;
	entityType: string;
	entityId: string | null;
	entityTitle: string | null;
	details: string | null;
	ipAddress: string | null;
	createdAt: Date;
}

function relativeTime(date: Date): string {
	const diff = Date.now() - new Date(date).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "Baru saja";
	if (minutes < 60) return `${minutes} menit lalu`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} jam lalu`;
	return `${Math.floor(hours / 24)} hari lalu`;
}

function isToday(date: Date): boolean {
	const d = new Date(date);
	const now = new Date();
	return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isYesterday(date: Date): boolean {
	const d = new Date(date);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
}

function getDateLabel(date: Date): string {
	if (isToday(date)) return "Hari ini";
	if (isYesterday(date)) return "Kemarin";
	return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function groupByDate(items: ActivityLog[]): { label: string; items: ActivityLog[] }[] {
	const groups: { label: string; items: ActivityLog[] }[] = [];
	let currentLabel = "";
	for (const item of items) {
		const label = getDateLabel(item.createdAt);
		if (label !== currentLabel) {
			currentLabel = label;
			groups.push({ label, items: [item] });
		} else {
			groups[groups.length - 1].items.push(item);
		}
	}
	return groups;
}

function ActivityPage() {
	const [action, setAction] = useState("");
	const [entityType, setEntityType] = useState("");
	const [days, setDays] = useState("7");
	const [page, setPage] = useState(1);
	const perPage = 20;

	const query = useQuery(
		orpc.admin.activity.list.queryOptions({
			input: {
				page,
				perPage,
				action: action || undefined,
				entityType: entityType || undefined,
				days: Number(days),
			},
		}),
	);

	const items = (query.data as { items: ActivityLog[]; page: number; perPage: number } | undefined)?.items ?? [];
	const hasMore = items.length === perPage;
	const groups = groupByDate(items);

	function resetFilters() {
		setAction("");
		setEntityType("");
		setDays("7");
		setPage(1);
	}

	const hasFilters = action || entityType || days !== "7";

	return (
		<div className="mx-auto max-w-3xl">
			{/* Filters */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<Select value={action} onValueChange={(v) => { setAction(v ?? ""); setPage(1); }}>
					<SelectTrigger className="w-40">
						<Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
						<SelectValue placeholder="Semua Aksi" />
					</SelectTrigger>
					<SelectContent>
						{ACTION_OPTIONS.map((opt) => (
							<SelectItem key={opt.value || "_all"} value={opt.value}>{opt.label}</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={entityType} onValueChange={(v) => { setEntityType(v ?? ""); setPage(1); }}>
					<SelectTrigger className="w-44">
						<SelectValue placeholder="Semua Entitas" />
					</SelectTrigger>
					<SelectContent>
						{ENTITY_OPTIONS.map((opt) => (
							<SelectItem key={opt.value || "_all"} value={opt.value}>{opt.label}</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={days} onValueChange={(v) => { setDays(v ?? "7"); setPage(1); }}>
					<SelectTrigger className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{DAYS_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
						Reset
					</Button>
				)}
			</div>

			{/* Timeline */}
			{query.isPending ? (
				<div className="flex flex-col gap-3">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="flex gap-3">
							<Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-full" />
							<div className="flex-1 space-y-1.5">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/3" />
							</div>
						</div>
					))}
				</div>
			) : items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<Clock className="mb-3 h-10 w-10 text-muted-foreground/40" />
					<p className="text-sm font-medium">Tidak ada aktivitas</p>
					<p className="mt-1 text-xs text-muted-foreground">Coba perluas rentang waktu atau ubah filter.</p>
				</div>
			) : (
				<div className="flex flex-col gap-8">
					{groups.map((group) => (
						<div key={group.label}>
							<p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{group.label}</p>
							<div className="relative flex flex-col gap-0">
								{/* Vertical line */}
								<div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />

								{group.items.map((log) => (
									<div key={log.id} className="relative flex gap-4 py-3">
										{/* Dot */}
										<div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-bold uppercase text-muted-foreground">
											{log.actorName.charAt(0)}
										</div>

										{/* Content */}
										<div className="flex-1 pt-1">
											<p className="text-sm leading-snug">
												<span className="font-medium">{log.actorName}</span>
												{" "}
												<span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"}`}>
													{log.action}
												</span>
												{" "}
												<span className="text-muted-foreground">{log.entityType}</span>
												{log.entityTitle && (
													<span className="font-medium"> "{log.entityTitle}"</span>
												)}
											</p>
											<p className="mt-0.5 text-xs text-muted-foreground">
												{relativeTime(log.createdAt)}
												{" · "}
												<span className="capitalize">{log.actorRole}</span>
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					))}

					{/* Load more */}
					{hasMore && (
						<div className="flex justify-center">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={query.isFetching}
							>
								{query.isFetching ? "Memuat..." : "Muat Lebih Banyak"}
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
