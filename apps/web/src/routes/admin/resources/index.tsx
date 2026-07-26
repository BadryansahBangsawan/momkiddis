import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { orpc, client } from "@/utils/orpc";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Switch } from "@momkiddis/ui/components/switch";
import { buttonVariants } from "@momkiddis/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@momkiddis/ui/components/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, FileText, Image, Archive } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/resources/")({
	component: ResourcesPage,
});

const CATEGORY_LABELS: Record<string, string> = {
	worksheet: "Worksheet",
	flashcard: "Flashcard",
	template: "Template",
	tips: "Tips & Tricks",
};

const FILE_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
	pdf:   ({ className }) => <FileText className={className} />,
	image: ({ className }) => <Image className={className} />,
	zip:   ({ className }) => <Archive className={className} />,
};

interface Resource {
	id: string;
	title: string;
	thumbnailUrl: string | null;
	category: string | null;
	fileType: string | null;
	isPublished: boolean;
	createdAt: Date;
}

function ResourcesPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [filterValues, setFilterValues] = useState<Record<string, string>>({});
	const [page, setPage] = useState(1);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const query = useQuery(
		orpc.admin.resources.list.queryOptions({
			input: {
				page,
				perPage: 10,
				category: filterValues.category || undefined,
				isPublished: filterValues.status === "published" ? true : filterValues.status === "draft" ? false : undefined,
			},
		}),
	);

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.resources.list.key(),
		});

	const toggleMutation = useMutation({
		mutationFn: (input: { id: string; value: boolean }) =>
			client.admin.resources.toggle(input),
		onSuccess: () => invalidate(),
		onError: (e: Error) => toast.error(e.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => client.admin.resources.delete({ id }),
		onSuccess: () => {
			toast.success("Resource berhasil dihapus");
			setDeleteId(null);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const columns: ColumnDef<Resource>[] = [
		{
			id: "thumbnail",
			header: "",
			cell: ({ row }) =>
				row.original.thumbnailUrl ? (
					<img src={row.original.thumbnailUrl} alt="" className="h-10 w-10 rounded object-cover" />
				) : (
					<div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
						<FileText className="h-5 w-5 text-muted-foreground" />
					</div>
				),
			size: 56,
		},
		{
			id: "title",
			header: "Judul",
			cell: ({ row }) => (
				<p className="max-w-[240px] truncate text-sm font-medium">{row.original.title}</p>
			),
		},
		{
			id: "category",
			header: "Kategori",
			cell: ({ row }) => (
				<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
					{row.original.category ? (CATEGORY_LABELS[row.original.category] ?? row.original.category) : "—"}
				</span>
			),
			size: 130,
		},
		{
			id: "fileType",
			header: "Tipe",
			cell: ({ row }) => {
				const Icon = row.original.fileType ? FILE_TYPE_ICONS[row.original.fileType] : null;
				return (
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						{Icon && <Icon className="h-3.5 w-3.5" />}
						{row.original.fileType?.toUpperCase() ?? "—"}
					</div>
				);
			},
			size: 80,
		},
		{
			id: "isPublished",
			header: "Published",
			cell: ({ row }) => (
				<Switch
					checked={row.original.isPublished}
					onCheckedChange={(val) =>
						toggleMutation.mutate({ id: row.original.id, value: val })
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
						<DropdownMenuItem onSelect={() => navigate({ to: "/admin/resources/$id", params: { id: row.original.id } })}>
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

	const items = (query.data as { items: Resource[]; total: number } | undefined)?.items ?? [];
	const total = (query.data as { items: Resource[]; total: number } | undefined)?.total ?? 0;

	return (
		<>
			<AdminDataTable
				columns={columns}
				data={items}
				isLoading={query.isPending}
				filters={[
					{
						key: "category",
						label: "Kategori",
						options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ label, value })),
					},
					{
						key: "status",
						label: "Status",
						options: [{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }],
					},
				]}
				filterValues={filterValues}
				onFilterChange={(k, v) => { setFilterValues((p) => ({ ...p, [k]: v })); setPage(1); }}
				onAdd={() => navigate({ to: "/admin/resources/$id", params: { id: "new" } })}
				addLabel="Tambah Resource"
				page={page}
				perPage={10}
				total={total}
				onPageChange={setPage}
				emptyTitle="Belum ada resource"
				emptyDescription="Tambahkan materi gratis pertama untuk peserta."
			/>

			<AdminConfirmDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
				title="Hapus Resource?"
				description="Resource ini akan dihapus permanen."
				confirmLabel="Ya, Hapus"
				variant="destructive"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
			/>
		</>
	);
}
