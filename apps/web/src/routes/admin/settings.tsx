import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { Switch } from "@momkiddis/ui/components/switch";
import { Button } from "@momkiddis/ui/components/button";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { Separator } from "@momkiddis/ui/components/separator";
import { ChevronUp, ChevronDown, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
	beforeLoad: ({ context }) => {
		const ctx = context as { isSuperAdmin?: boolean };
		if (!ctx.isSuperAdmin) {
			throw redirect({ to: "/admin" });
		}
	},
	component: SettingsPage,
});

interface MenuItem {
	menuKey: string;
	label: string;
	icon: string;
	isEnabled: boolean;
	sortOrder: number;
}

function SettingsPage() {
	const queryClient = useQueryClient();
	const menuQuery = useQuery(orpc.admin.settings.getMenuConfig.queryOptions());

	const updateMutation = useMutation({
		mutationFn: (input: { menuKey: string; isEnabled: boolean; sortOrder: number }[]) =>
			client.admin.settings.updateMenuConfig(input),
		onSuccess: () => {
			toast.success("Pengaturan menu berhasil disimpan");
			queryClient.invalidateQueries({
				queryKey: orpc.admin.settings.getMenuConfig.queryOptions().queryKey,
			});
		},
		onError: (err: Error) => {
			toast.error(err.message ?? "Gagal menyimpan pengaturan");
		},
	});

	const seedMutation = useMutation({
		mutationFn: () => client.admin.settings.seedDefaultMenus(undefined),
		onSuccess: () => {
			toast.success("Menu default berhasil di-seed");
			setLocalMenus(null);
			queryClient.invalidateQueries({
				queryKey: orpc.admin.settings.getMenuConfig.queryOptions().queryKey,
			});
		},
		onError: (err: Error) => toast.error(err.message ?? "Gagal seed menu"),
	});

	const [localMenus, setLocalMenus] = useState<MenuItem[] | null>(null);

	const serverMenus = (menuQuery.data as MenuItem[] | undefined)
		?.slice()
		.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));

	const menus: MenuItem[] = localMenus ?? serverMenus ?? [];

	// One-time sync from server when data first arrives
	if (!localMenus && serverMenus && serverMenus.length > 0) {
		setLocalMenus(serverMenus);
	}

	function toggleMenu(menuKey: string, enabled: boolean) {
		setLocalMenus((prev) =>
			(prev ?? menus).map((m) => (m.menuKey === menuKey ? { ...m, isEnabled: enabled } : m)),
		);
	}

	function moveItem(index: number, direction: "up" | "down") {
		setLocalMenus((prev) => {
			const list = [...(prev ?? menus)];
			const swapIdx = direction === "up" ? index - 1 : index + 1;
			if (swapIdx < 0 || swapIdx >= list.length) return list;
			[list[index], list[swapIdx]] = [list[swapIdx], list[index]];
			return list;
		});
	}

	function handleSave() {
		updateMutation.mutate(
			menus.map((m, i) => ({
				menuKey: m.menuKey,
				isEnabled: m.isEnabled,
				sortOrder: i + 1,
			})),
		);
	}

	const isLoading = menuQuery.isPending;
	const isSaving = updateMutation.isPending;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-muted-foreground text-sm">
					Atur menu mana yang bisa diakses oleh admin biasa.
				</p>
				<div className="flex items-center gap-2">
					{menus.length === 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => seedMutation.mutate()}
							disabled={seedMutation.isPending}
						>
							<RefreshCw className={`mr-2 h-3.5 w-3.5 ${seedMutation.isPending ? "animate-spin" : ""}`} />
							{seedMutation.isPending ? "Seeding..." : "Seed Default Menu"}
						</Button>
					)}
					<Button onClick={handleSave} disabled={isSaving || isLoading || menus.length === 0}>
						{isSaving ? "Menyimpan..." : "Simpan Perubahan"}
					</Button>
				</div>
			</div>

			<div className="rounded-lg border">
				{/* Table header */}
				<div className="bg-muted/40 flex items-center gap-4 rounded-t-lg border-b px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<div className="w-10" />
					<div className="flex-1">Menu</div>
					<div className="w-24 text-center">Aktif untuk Admin</div>
					<div className="w-24 text-center">Urutan</div>
				</div>

				{/* Rows */}
				{isLoading ? (
					<div className="flex flex-col divide-y">
						{Array.from({ length: 7 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4 px-4 py-4">
								<Skeleton className="h-8 w-8 rounded-md" />
								<Skeleton className="h-4 w-32" />
								<div className="ml-auto flex gap-6">
									<Skeleton className="h-5 w-10 rounded-full" />
									<Skeleton className="h-7 w-16 rounded" />
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col divide-y">
						{menus.map((menu, index) => (
							<div
								key={menu.menuKey}
								className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/20"
							>
								{/* Icon/initials */}
								<div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground uppercase">
									{menu.label.slice(0, 2)}
								</div>

								{/* Label + path */}
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium">{menu.label}</p>
									<p className="text-muted-foreground text-xs">/admin/{menu.menuKey}</p>
								</div>

								{/* Toggle */}
								<div className="flex w-24 justify-center">
									<Switch
										checked={menu.isEnabled}
										onCheckedChange={(checked) => toggleMenu(menu.menuKey, checked)}
									/>
								</div>

								{/* Reorder buttons */}
								<div className="flex w-24 items-center justify-center gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										disabled={index === 0}
										onClick={() => moveItem(index, "up")}
									>
										<ChevronUp className="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										disabled={index === menus.length - 1}
										onClick={() => moveItem(index, "down")}
									>
										<ChevronDown className="h-3.5 w-3.5" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<Separator />

			{/* Notes */}
			<div className="space-y-1.5 rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
				<div className="flex items-center gap-2 font-medium text-foreground">
					<Shield className="h-4 w-4" />
					Catatan
				</div>
				<p>Dashboard selalu aktif untuk semua admin dan tidak bisa dinonaktifkan.</p>
				<p>
					Menu <strong>Users</strong>, <strong>Activity Log</strong>,{" "}
					<strong>Konfigurasi</strong>, dan <strong>Pengaturan Menu</strong> hanya
					bisa diakses superadmin dan tidak terpengaruh pengaturan ini.
				</p>
			</div>
		</div>
	);
}
