import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { orpc, client } from "@/utils/orpc";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Switch } from "@momkiddis/ui/components/switch";
import { buttonVariants } from "@momkiddis/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@momkiddis/ui/components/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials/")({
	component: TestimonialsPage,
});

const PROGRAM_OPTIONS = [
	{ label: "Momsky Class", value: "momsky-class" },
	{ label: "Kiddis Class", value: "kiddis-class" },
	{ label: "Teenager Class", value: "teenager-class" },
	{ label: "Professional Class", value: "professional-class" },
	{ label: "IELTS & TOEFL Class", value: "ielts-toefl-class" },
];

interface Testimonial {
	id: string;
	authorName: string;
	authorRole: string;
	authorImage: string | null;
	programSlug: string | null;
	content: string;
	rating: number;
	isPublished: boolean;
	isFeatured: boolean;
	createdAt: Date;
}

function TestimonialsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [search, setSearch] = useState("");
	const [filterValues, setFilterValues] = useState<Record<string, string>>({});
	const [page, setPage] = useState(1);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

	const query = useQuery(
		orpc.admin.testimonials.list.queryOptions({
			input: {
				page,
				perPage: 10,
				search: search || undefined,
				programSlug: filterValues.programSlug || undefined,
				isPublished:
					filterValues.status === "published"
						? true
						: filterValues.status === "draft"
							? false
							: undefined,
			},
		}),
	);

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.testimonials.list.queryOptions({ input: { page: 1, perPage: 10 } }).queryKey,
		});

	const toggleMutation = useMutation({
		mutationFn: (input: { id: string; field: "isPublished" | "isFeatured"; value: boolean }) =>
			client.admin.testimonials.toggle(input),
		onSuccess: () => invalidate(),
		onError: (e: Error) => toast.error(e.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => client.admin.testimonials.delete({ id }),
		onSuccess: () => {
			toast.success("Testimoni berhasil dihapus");
			setDeleteId(null);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const bulkMutation = useMutation({
		mutationFn: (input: { ids: string[]; action: "publish" | "unpublish" | "delete" }) =>
			client.admin.testimonials.bulkAction(input),
		onSuccess: (_, vars) => {
			toast.success(
				vars.action === "delete"
					? `${vars.ids.length} testimoni dihapus`
					: `${vars.ids.length} testimoni di-${vars.action}`,
			);
			setBulkDeleteIds([]);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const columns: ColumnDef<Testimonial>[] = [
		{
			id: "author",
			header: "Penulis",
			cell: ({ row }) => (
				<div>
					<p className="text-sm font-medium">{row.original.authorName}</p>
					<p className="text-xs text-muted-foreground">{row.original.authorRole}</p>
				</div>
			),
		},
		{
			id: "program",
			header: "Program",
			cell: ({ row }) => {
				const prog = PROGRAM_OPTIONS.find((p) => p.value === row.original.programSlug);
				return prog ? (
					<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
						{prog.label}
					</span>
				) : (
					<span className="text-xs text-muted-foreground">—</span>
				);
			},
			size: 160,
		},
		{
			id: "rating",
			header: "Rating",
			cell: ({ row }) => (
				<span className="text-sm">{"★".repeat(row.original.rating)}</span>
			),
			size: 90,
		},
		{
			id: "content",
			header: "Isi",
			cell: ({ row }) => (
				<p className="max-w-[260px] truncate text-sm text-muted-foreground">
					{row.original.content}
				</p>
			),
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
			id: "isFeatured",
			header: "Featured",
			cell: ({ row }) => (
				<Switch
					checked={row.original.isFeatured}
					onCheckedChange={(val) =>
						toggleMutation.mutate({ id: row.original.id, field: "isFeatured", value: val })
					}
				/>
			),
			size: 100,
		},
		{
			id: "status",
			header: "Status",
			cell: ({ row }) => (
				<AdminStatusBadge
					status={
						row.original.isFeatured
							? "featured"
							: row.original.isPublished
								? "published"
								: "draft"
					}
				/>
			),
			size: 100,
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
						<MoreHorizontal className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onSelect={() =>
								navigate({ to: "/admin/testimonials/$id", params: { id: row.original.id } })
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

	const items = (query.data as { items: Testimonial[]; total: number } | undefined)?.items ?? [];
	const total = (query.data as { items: Testimonial[]; total: number } | undefined)?.total ?? 0;

	return (
		<>
			<AdminDataTable
				columns={columns}
				data={items}
				isLoading={query.isPending}
				searchPlaceholder="Cari nama penulis..."
				searchValue={search}
				onSearchChange={(v) => { setSearch(v); setPage(1); }}
				filters={[
					{
						key: "programSlug",
						label: "Program",
						options: PROGRAM_OPTIONS,
					},
					{
						key: "status",
						label: "Status",
						options: [
							{ label: "Published", value: "published" },
							{ label: "Draft", value: "draft" },
						],
					},
				]}
				filterValues={filterValues}
				onFilterChange={(k, v) => { setFilterValues((p) => ({ ...p, [k]: v })); setPage(1); }}
				enableBulkSelect
				bulkActions={[
					{ label: "Publish", action: "publish" },
					{ label: "Unpublish", action: "unpublish" },
					{ label: "Hapus", action: "delete", variant: "destructive" },
				]}
				onBulkAction={(action, ids) => {
					if (action === "delete") {
						setBulkDeleteIds(ids);
					} else {
						bulkMutation.mutate({ ids, action: action as "publish" | "unpublish" });
					}
				}}
				onAdd={() => navigate({ to: "/admin/testimonials/$id", params: { id: "new" } })}
				addLabel="Tambah Testimoni"
				page={page}
				perPage={10}
				total={total}
				onPageChange={setPage}
				emptyTitle="Belum ada testimoni"
				emptyDescription="Tambahkan testimoni pertama dari peserta Momkiddis."
			/>

			{/* Delete single */}
			<AdminConfirmDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
				title="Hapus Testimoni?"
				description="Testimoni ini akan dihapus permanen dan tidak bisa dikembalikan."
				confirmLabel="Ya, Hapus"
				variant="destructive"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
			/>

			{/* Bulk delete */}
			<AdminConfirmDialog
				open={bulkDeleteIds.length > 0}
				onOpenChange={(open) => !open && setBulkDeleteIds([])}
				title={`Hapus ${bulkDeleteIds.length} Testimoni?`}
				description="Semua testimoni yang dipilih akan dihapus permanen."
				confirmLabel="Ya, Hapus Semua"
				variant="destructive"
				isLoading={bulkMutation.isPending}
				onConfirm={() =>
					bulkMutation.mutate({ ids: bulkDeleteIds, action: "delete" })
				}
			/>
		</>
	);
}
