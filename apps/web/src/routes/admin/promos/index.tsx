import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { orpc, client } from "@/utils/orpc";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Switch } from "@momkiddis/ui/components/switch";
import { Button } from "@momkiddis/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@momkiddis/ui/components/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/promos/")({
	component: PromosPage,
});

const PROGRAM_LABELS: Record<string, string> = {
	"momsky-class": "Momsky Class",
	"kiddis-class": "Kiddis Class",
	"teenager-class": "Teenager Class",
	"professional-class": "Professional Class",
	"ielts-toefl-class": "IELTS & TOEFL Class",
};

interface Promo {
	id: string;
	title: string;
	programSlug: string | null;
	discountLabel: string | null;
	validFrom: Date | null;
	validUntil: Date | null;
	isActive: boolean;
	isExpired: boolean;
	createdAt: Date;
}

function formatDate(d: Date | null) {
	if (!d) return null;
	return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function PromoStatusBadge({ isActive, isExpired }: { isActive: boolean; isExpired: boolean }) {
	if (!isActive) return (
		<span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Nonaktif</span>
	);
	if (isExpired) return (
		<span className="inline-flex rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">Expired</span>
	);
	return (
		<span className="inline-flex rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Aktif</span>
	);
}

function PromosPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [filterValues, setFilterValues] = useState<Record<string, string>>({});
	const [page, setPage] = useState(1);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const query = useQuery(
		orpc.admin.promos.list.queryOptions({
			page,
			perPage: 10,
			isActive: filterValues.status === "active" ? true : filterValues.status === "inactive" ? false : undefined,
			programSlug: filterValues.programSlug || undefined,
		}),
	);

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.promos.list.queryOptions({ page: 1, perPage: 10 }).queryKey,
		});

	const toggleMutation = useMutation({
		mutationFn: (input: { id: string; value: boolean }) =>
			client.admin.promos.toggle(input),
		onSuccess: () => invalidate(),
		onError: (e: Error) => toast.error(e.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => client.admin.promos.delete({ id }),
		onSuccess: () => {
			toast.success("Promo berhasil dihapus");
			setDeleteId(null);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const columns: ColumnDef<Promo>[] = [
		{
			id: "title",
			header: "Judul",
			cell: ({ row }) => (
				<p className="max-w-[200px] truncate text-sm font-medium">{row.original.title}</p>
			),
		},
		{
			id: "program",
			header: "Program",
			cell: ({ row }) => {
				const label = row.original.programSlug ? PROGRAM_LABELS[row.original.programSlug] ?? row.original.programSlug : null;
				return label ? (
					<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
						{label}
					</span>
				) : (
					<span className="text-xs text-muted-foreground">Semua Program</span>
				);
			},
			size: 150,
		},
		{
			id: "discountLabel",
			header: "Diskon",
			cell: ({ row }) => (
				<span className="text-sm font-medium">{row.original.discountLabel ?? "—"}</span>
			),
			size: 120,
		},
		{
			id: "periode",
			header: "Periode",
			cell: ({ row }) => {
				const from = formatDate(row.original.validFrom);
				const until = formatDate(row.original.validUntil);
				if (!from && !until) return <span className="text-xs text-muted-foreground">—</span>;
				return (
					<div className="text-xs text-muted-foreground">
						{from && <p>{from}</p>}
						{until && <p>s/d {until}</p>}
					</div>
				);
			},
			size: 140,
		},
		{
			id: "status",
			header: "Status",
			cell: ({ row }) => (
				<PromoStatusBadge isActive={row.original.isActive} isExpired={row.original.isExpired} />
			),
			size: 90,
		},
		{
			id: "isActive",
			header: "Aktif",
			cell: ({ row }) => (
				<Switch
					checked={row.original.isActive}
					onCheckedChange={(val) =>
						toggleMutation.mutate({ id: row.original.id, value: val })
					}
				/>
			),
			size: 70,
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon-sm">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onSelect={() => navigate({ to: "/admin/promos/$id", params: { id: row.original.id } })}>
							<Pencil className="mr-2 h-3.5 w-3.5" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive" onSelect={() => setDeleteId(row.original.id)}>
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							Hapus
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
			size: 60,
		},
	];

	const items = (query.data as { items: Promo[]; total: number } | undefined)?.items ?? [];
	const total = (query.data as { items: Promo[]; total: number } | undefined)?.total ?? 0;

	return (
		<>
			<AdminDataTable
				columns={columns}
				data={items}
				isLoading={query.isPending}
				filters={[
					{
						key: "programSlug",
						label: "Program",
						options: Object.entries(PROGRAM_LABELS).map(([value, label]) => ({ label, value })),
					},
					{
						key: "status",
						label: "Status",
						options: [
							{ label: "Aktif", value: "active" },
							{ label: "Nonaktif", value: "inactive" },
						],
					},
				]}
				filterValues={filterValues}
				onFilterChange={(k, v) => { setFilterValues((p) => ({ ...p, [k]: v })); setPage(1); }}
				onAdd={() => navigate({ to: "/admin/promos/$id", params: { id: "new" } })}
				addLabel="Tambah Promo"
				page={page}
				perPage={10}
				total={total}
				onPageChange={setPage}
				emptyTitle="Belum ada promo"
				emptyDescription="Tambahkan promo atau diskon pertama untuk program Momkiddis."
			/>

			<AdminConfirmDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
				title="Hapus Promo?"
				description="Promo ini akan dihapus permanen."
				confirmLabel="Ya, Hapus"
				variant="destructive"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
			/>
		</>
	);
}
