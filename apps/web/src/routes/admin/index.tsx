import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { buttonVariants } from "@momkiddis/ui/components/button";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@momkiddis/ui/components/card";
import {
	MessageSquareQuote,
	GraduationCap,
	Image,
	Calendar,
	Download,
	Tag,
	Users,
	Mail,
	ArrowRight,
	Clock,
} from "lucide-react";
import { cn } from "@momkiddis/ui/lib/utils";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	const ctx = Route.useRouteContext() as { isSuperAdmin?: boolean };
	const isSuperAdmin = ctx.isSuperAdmin ?? false;

	const statsQuery = useQuery(orpc.admin.stats.summary.queryOptions());
	const activityQuery = useQuery({
		...orpc.admin.stats.recentActivity.queryOptions(),
		enabled: isSuperAdmin,
	});

	const stats = statsQuery.data;
	const isLoading = statsQuery.isPending;
	const unreadCount = stats?.contacts.unread ?? 0;

	return (
		<div className="flex flex-col gap-6">
			{/* Unread contacts banner */}
			{unreadCount > 0 && (
				<div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center justify-between rounded-lg border px-4 py-3">
					<div className="flex items-center gap-2 text-sm font-medium">
						<Mail className="h-4 w-4 shrink-0" />
						<span>{unreadCount} pesan masuk belum dibaca</span>
					</div>
					<Link
												to="/admin/contacts"
						className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
					>
						Lihat Pesan
						<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
					</Link>
				</div>
			)}

			{/* Stat cards */}
			{isLoading ? (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full rounded-lg" />
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<AdminStatCard
						icon={MessageSquareQuote}
						label="Testimoni"
						value={stats?.testimonials.total ?? 0}
						sub={`${stats?.testimonials.published ?? 0} dipublish`}
						iconColor="text-blue-500"
					/>
					<AdminStatCard
						icon={GraduationCap}
						label="Alumni"
						value={stats?.alumni.total ?? 0}
						sub={`${stats?.alumni.featured ?? 0} featured`}
						iconColor="text-green-500"
					/>
					<AdminStatCard
						icon={Image}
						label="Galeri"
						value={stats?.gallery.total ?? 0}
						sub={`${stats?.gallery.published ?? 0} dipublish`}
						iconColor="text-purple-500"
					/>
					<AdminStatCard
						icon={Calendar}
						label="Event"
						value={stats?.events.total ?? 0}
						sub={`${stats?.events.upcoming ?? 0} akan datang`}
						iconColor="text-orange-500"
					/>
					<AdminStatCard
						icon={Download}
						label="Resources"
						value={stats?.resources.total ?? 0}
						sub={`${stats?.resources.published ?? 0} dipublish`}
						iconColor="text-teal-500"
					/>
					<AdminStatCard
						icon={Tag}
						label="Promo"
						value={stats?.promos.total ?? 0}
						sub={`${stats?.promos.active ?? 0} aktif`}
						iconColor="text-yellow-500"
					/>
					<AdminStatCard
						icon={Users}
						label="Admin"
						value={stats?.users.total ?? 0}
						iconColor="text-slate-500"
					/>
					<AdminStatCard
						icon={Mail}
						label="Pesan Masuk"
						value={stats?.contacts.total ?? 0}
						sub={`${stats?.contacts.unread ?? 0} belum dibaca`}
						iconColor="text-rose-500"
					/>
				</div>
			)}

			{/* Recent activity — superadmin only */}
			{isSuperAdmin && (
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-semibold">Aktivitas Terbaru</CardTitle>
							<Link
									to="/admin/activity"
								className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
							>
								Lihat semua
								<ArrowRight className="h-3 w-3" />
							</Link>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{activityQuery.isPending ? (
							<div className="flex flex-col gap-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-10 w-full" />
								))}
							</div>
						) : !activityQuery.data?.length ? (
							<p className="text-muted-foreground py-8 text-center text-sm">
								Belum ada aktivitas tercatat.
							</p>
						) : (
							<div className="flex flex-col divide-y">
								{activityQuery.data.map((item: ActivityItem) => (
									<div key={item.id} className="flex items-start gap-3 py-3">
										<div className="bg-muted mt-0.5 shrink-0 rounded-full p-1.5">
											<Clock className="text-muted-foreground h-3 w-3" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm leading-snug">
												<span className="font-medium">{item.actorName}</span>{" "}
												<span className="text-muted-foreground">
													{ACTION_LABELS[item.action] ?? item.action}
												</span>
												{item.entityTitle && (
													<>
														{" "}
														<span className="font-medium">"{item.entityTitle}"</span>
													</>
												)}
											</p>
											<p className="text-muted-foreground mt-0.5 text-xs">
												{relativeTime(typeof item.createdAt === "number" ? item.createdAt : new Date(item.createdAt).getTime())}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

interface ActivityItem {
	id: string;
	actorName: string;
	action: string;
	entityTitle: string | null;
	createdAt: number | Date;
}

const ACTION_LABELS: Record<string, string> = {
	create: "menambah",
	update: "mengubah",
	delete: "menghapus",
	bulk_delete: "menghapus banyak",
	publish: "mempublish",
	unpublish: "meng-unpublish",
	toggle_featured: "mengubah featured",
	export: "mengexport",
	role_change: "mengubah role",
	menu_toggle: "mengubah menu",
	config_update: "mengubah konfigurasi",
	status_change: "mengubah status",
};

function relativeTime(ts: number): string {
	const diff = Date.now() - ts;
	const mins = Math.floor(diff / 60_000);
	if (mins < 1) return "baru saja";
	if (mins < 60) return `${mins} menit lalu`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs} jam lalu`;
	const days = Math.floor(hrs / 24);
	if (days === 1) return "kemarin";
	return `${days} hari lalu`;
}
