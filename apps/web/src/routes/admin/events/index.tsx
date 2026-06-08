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

export const Route = createFileRoute("/admin/events/")({
	component: EventsPage,
});

const TYPE_LABELS: Record<string, string> = {
	webinar: "Webinar",
	workshop: "Workshop",
	"kelas-terbuka": "Kelas Terbuka",
};

interface Event {
	id: string;
	title: string;
	date: Date;
	endDate: Date | null;
	location: string | null;
	type: string;
	isUpcoming: boolean;
	isPublished: boolean;
	maxSeats: number | null;
}

function formatDate(d: Date | null) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function EventsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [page, setPage] = useState(1);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const query = useQuery(
		orpc.admin.events.list.queryOptions({ page, perPage: 10 }),
	);

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.events.list.queryOptions({ page: 1, perPage: 10 }).queryKey,
		});

	const toggleMutation = useMutation({
		mutationFn: (input: { id: string; field: "isPublished" | "isUpcoming"; value: boolean }) =>
			client.admin.events.toggle(input),
		onSuccess: () => invalidate(),
		onError: (e: Error) => toast.error(e.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => client.admin.events.delete({ id }),
		onSuccess: () => {
			toast.success("Event berhasil dihapus");
			setDeleteId(null);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const columns: ColumnDef<Event>[] = [
		{
			id: "title",
			header: "Judul",
			cell: ({ row }) => (
				<p className="max-w-[220px] truncate text-sm font-medium">{row.original.title}</p>
			),
		},
		{
			id: "date",
			header: "Tanggal",
			cell: ({ row }) => (
				<div className="text-xs text-muted-foreground">
					<p>{formatDate(row.original.date)}</p>
					{row.original.endDate && <p>s/d {formatDate(row.original.endDate)}</p>}
				</div>
			),
			size: 130,
		},
		{
			id: "location",
			header: "Lokasi",
			cell: ({ row }) => (
				<p className="max-w-[140px] truncate text-xs text-muted-foreground">
					{row.original.location ?? "—"}
				</p>
			),
			size: 160,
		},
		{
			id: "type",
			header: "Tipe",
			cell: ({ row }) => (
				<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
					{TYPE_LABELS[row.original.type] ?? row.original.type}
				</span>
			),
			size: 120,
		},
		{
			id: "isUpcoming",
			header: "Akan Datang",
			cell: ({ row }) => (
				<Switch
					checked={row.original.isUpcoming}
					onCheckedChange={(val) =>
						toggleMutation.mutate({ id: row.original.id, field: "isUpcoming", value: val })
					}
				/>
			),
			size: 110,
		},
		{
			id: "isPublished",
			header: "Published",
			cell: ({ row }) => (
				<Switch
					checked={row.original.isPublished}
					onCheckedChange={(val) =>
						toggleMutation.mutate({ id: row.original.id, field: "isPublished", value: val })
					}
				/>
			),
			size: 100,
		},
		{
			id: "maxSeats",
			header: "Max Kursi",
			cell: ({ row }) => (
				<span className="text-xs text-muted-foreground">
					{row.original.maxSeats ?? "—"}
				</span>
			),
			size: 90,
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
						<DropdownMenuItem
							onSelect={() =>
								navigate({ to: "/admin/events/$id", params: { id: row.original.id } })
							}
						>
							<Pencil className="mr-2 h-3.5 w-3.5" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-destructive"
							onSelect={() => setDeleteId(row.original.id)}
						>
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							Hapus
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
			size: 60,
		},
	];

	const items = (query.data as { items: Event[]; total: number } | undefined)?.items ?? [];
	const total = (query.data as { items: Event[]; total: number } | undefined)?.total ?? 0;

	return (
		<>
			<AdminDataTable
				columns={columns}
				data={items}
				isLoading={query.isPending}
				onAdd={() => navigate({ to: "/admin/events/$id", params: { id: "new" } })}
				addLabel="Tambah Event"
				page={page}
				perPage={10}
				total={total}
				onPageChange={setPage}
				emptyTitle="Belum ada event"
				emptyDescription="Tambahkan event atau webinar pertama."
			/>

			<AdminConfirmDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
				title="Hapus Event?"
				description="Event ini akan dihapus permanen."
				confirmLabel="Ya, Hapus"
				variant="destructive"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
			/>
		</>
	);
}
