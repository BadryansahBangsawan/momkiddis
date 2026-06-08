import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Switch } from "@momkiddis/ui/components/switch";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@momkiddis/ui/components/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@momkiddis/ui/components/select";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery/")({
	component: GalleryPage,
});

interface GalleryItem {
	id: string;
	imageUrl: string;
	caption: string;
	event: string;
	takenAt: Date;
	isPublished: boolean;
}

interface FormData {
	imageUrl: string;
	caption: string;
	event: string;
	takenAt: string;
	isPublished: boolean;
}

const EMPTY_FORM: FormData = {
	imageUrl: "",
	caption: "",
	event: "",
	takenAt: "",
	isPublished: false,
};

const STATUS_FILTERS = [
	{ label: "Published", value: "published" },
	{ label: "Draft", value: "draft" },
];

function toDateString(ts: Date | number | null | undefined): string {
	if (!ts) return "";
	return new Date(ts).toISOString().split("T")[0];
}

function GalleryPage() {
	const queryClient = useQueryClient();

	const [filterStatus, setFilterStatus] = useState("");
	const [page, setPage] = useState(1);
	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [editItem, setEditItem] = useState<GalleryItem | null>(null);
	const [form, setForm] = useState<FormData>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const query = useQuery(
		orpc.admin.gallery.list.queryOptions({
			input: {
				page,
				perPage: 20,
				isPublished:
					filterStatus === "published"
						? true
						: filterStatus === "draft"
							? false
							: undefined,
			},
		}),
	);

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.gallery.list.queryOptions({ input: { page: 1, perPage: 20 } }).queryKey,
		});

	const createMutation = useMutation({
		mutationFn: (data: FormData) =>
			client.admin.gallery.create({
				imageUrl: data.imageUrl,
				caption: data.caption,
				event: data.event,
				takenAt: new Date(data.takenAt).getTime(),
				isPublished: data.isPublished,
			}),
		onSuccess: () => {
			toast.success("Foto berhasil ditambahkan");
			closeDialog();
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: (data: FormData & { id: string }) =>
			client.admin.gallery.update({
				id: data.id,
				imageUrl: data.imageUrl,
				caption: data.caption,
				event: data.event,
				takenAt: new Date(data.takenAt).getTime(),
				isPublished: data.isPublished,
			}),
		onSuccess: () => {
			toast.success("Foto berhasil diperbarui");
			closeDialog();
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const toggleMutation = useMutation({
		mutationFn: (input: { id: string; value: boolean }) =>
			client.admin.gallery.toggle(input),
		onSuccess: () => invalidate(),
		onError: (e: Error) => toast.error(e.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => client.admin.gallery.delete({ id }),
		onSuccess: () => {
			toast.success("Foto berhasil dihapus");
			setDeleteId(null);
			invalidate();
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function openAdd() {
		setForm(EMPTY_FORM);
		setErrors({});
		setDialogMode("add");
	}

	function openEdit(item: GalleryItem) {
		setEditItem(item);
		setForm({
			imageUrl: item.imageUrl,
			caption: item.caption,
			event: item.event,
			takenAt: toDateString(item.takenAt),
			isPublished: item.isPublished,
		});
		setErrors({});
		setDialogMode("edit");
	}

	function closeDialog() {
		setDialogMode(null);
		setEditItem(null);
	}

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (!form.imageUrl) e.imageUrl = "URL gambar wajib diisi";
		if (form.caption.trim().length < 2) e.caption = "Minimal 2 karakter";
		if (form.event.trim().length < 2) e.event = "Minimal 2 karakter";
		if (!form.takenAt) e.takenAt = "Tanggal wajib diisi";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit() {
		if (!validate()) return;
		if (dialogMode === "add") createMutation.mutate(form);
		else if (dialogMode === "edit" && editItem)
			updateMutation.mutate({ ...form, id: editItem.id });
	}

	const isSaving = createMutation.isPending || updateMutation.isPending;
	const items =
		(query.data as { items: GalleryItem[]; total: number } | undefined)?.items ?? [];
	const total =
		(query.data as { items: GalleryItem[]; total: number } | undefined)?.total ?? 0;
	const totalPages = Math.ceil(total / 20);

	return (
		<div className="flex flex-col gap-5">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3">
				<Select
					value={filterStatus}
					onValueChange={(val) => {
						setFilterStatus(val ?? "");
						setPage(1);
					}}
				>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Semua Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Semua Status</SelectItem>
						{STATUS_FILTERS.map((f) => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<p className="text-sm text-muted-foreground">{total} foto</p>

				<div className="ml-auto">
					<Button size="sm" onClick={openAdd}>
						<Plus className="mr-2 h-4 w-4" />
						Tambah Foto
					</Button>
				</div>
			</div>

			{/* Grid */}
			{query.isPending ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="aspect-square rounded-xl" />
					))}
				</div>
			) : items.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
					<p className="text-sm font-medium text-foreground">Belum ada foto</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Tambahkan foto galeri kegiatan Momkiddis.
					</p>
					<Button size="sm" className="mt-4" onClick={openAdd}>
						<Plus className="mr-2 h-4 w-4" />
						Tambah Foto
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{items.map((item) => (
						<GalleryCard
							key={item.id}
							item={item}
							onEdit={() => openEdit(item)}
							onDelete={() => setDeleteId(item.id)}
							onToggle={(val) => toggleMutation.mutate({ id: item.id, value: val })}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<p className="text-muted-foreground">
						Halaman {page} dari {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => setPage((p) => p - 1)}
						>
							Sebelumnya
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => setPage((p) => p + 1)}
						>
							Berikutnya
						</Button>
					</div>
				</div>
			)}

			{/* Add / Edit Dialog */}
			<Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{dialogMode === "add" ? "Tambah Foto" : "Edit Foto"}
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">
								URL Gambar <span className="text-destructive">*</span>
							</label>
							<Input
								value={form.imageUrl}
								onChange={(e) => set("imageUrl", e.target.value)}
								placeholder="https://..."
								type="url"
							/>
							{errors.imageUrl && (
								<p className="text-xs text-destructive">{errors.imageUrl}</p>
							)}
							{form.imageUrl && (
								<img
									src={form.imageUrl}
									alt="Preview"
									className="mt-1 aspect-video w-full rounded-lg object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).style.display = "none";
									}}
								/>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">
								Caption <span className="text-destructive">*</span>
							</label>
							<Input
								value={form.caption}
								onChange={(e) => set("caption", e.target.value)}
								placeholder="Foto kegiatan Workshop Batch 9..."
							/>
							{errors.caption && (
								<p className="text-xs text-destructive">{errors.caption}</p>
							)}
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Nama Event <span className="text-destructive">*</span>
								</label>
								<Input
									value={form.event}
									onChange={(e) => set("event", e.target.value)}
									placeholder="Workshop Batch 9"
								/>
								{errors.event && (
									<p className="text-xs text-destructive">{errors.event}</p>
								)}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Tanggal <span className="text-destructive">*</span>
								</label>
								<Input
									type="date"
									value={form.takenAt}
									onChange={(e) => set("takenAt", e.target.value)}
								/>
								{errors.takenAt && (
									<p className="text-xs text-destructive">{errors.takenAt}</p>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border px-4 py-3">
							<div>
								<p className="text-sm font-medium">Published</p>
								<p className="text-xs text-muted-foreground">Tampilkan di galeri publik</p>
							</div>
							<Switch
								checked={form.isPublished}
								onCheckedChange={(val) => set("isPublished", val)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={closeDialog} disabled={isSaving}>
							Batal
						</Button>
						<Button onClick={handleSubmit} disabled={isSaving}>
							{isSaving ? "Menyimpan..." : "Simpan"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete confirm */}
			<AdminConfirmDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
				title="Hapus Foto?"
				description="Foto ini akan dihapus permanen dari galeri."
				confirmLabel="Ya, Hapus"
				variant="destructive"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
			/>
		</div>
	);
}

function GalleryCard({
	item,
	onEdit,
	onDelete,
	onToggle,
}: {
	item: GalleryItem;
	onEdit: () => void;
	onDelete: () => void;
	onToggle: (val: boolean) => void;
}) {
	return (
		<div className="group relative aspect-square overflow-hidden rounded-xl border bg-muted">
			<img
				src={item.imageUrl}
				alt={item.caption}
				className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
				onClick={onEdit}
				style={{ cursor: "pointer" }}
			/>

			{/* Overlay on hover */}
			<div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
				{/* Top: toggle published + delete */}
				<div className="flex items-start justify-between gap-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggle(!item.isPublished);
						}}
						className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
					>
						{item.isPublished ? (
							<>
								<Eye className="h-3 w-3" /> Published
							</>
						) : (
							<>
								<EyeOff className="h-3 w-3" /> Draft
							</>
						)}
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="flex size-6 items-center justify-center rounded-full bg-destructive/80 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
					>
						<Trash2 className="h-3 w-3" />
					</button>
				</div>

				{/* Bottom: caption */}
				<div onClick={onEdit} style={{ cursor: "pointer" }}>
					<p className="line-clamp-2 text-[11px] font-medium leading-snug text-white">
						{item.caption}
					</p>
					<p className="mt-0.5 text-[10px] text-white/70">{item.event}</p>
				</div>
			</div>

			{/* Draft indicator badge */}
			{!item.isPublished && (
				<div className="absolute right-2 top-2 rounded-full bg-gray-900/70 px-1.5 py-0.5 text-[9px] font-medium text-white/80 group-hover:hidden">
					Draft
				</div>
			)}
		</div>
	);
}
