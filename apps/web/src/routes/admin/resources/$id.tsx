import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Textarea } from "@momkiddis/ui/components/textarea";
import { Switch } from "@momkiddis/ui/components/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@momkiddis/ui/components/select";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/resources/$id")({
	component: ResourceFormPage,
});

interface FormData {
	title: string;
	description: string;
	category: "worksheet" | "flashcard" | "template" | "tips" | "";
	fileUrl: string;
	thumbnailUrl: string;
	fileType: "pdf" | "image" | "zip" | "";
	isPublished: boolean;
}

const EMPTY: FormData = {
	title: "", description: "", category: "", fileUrl: "",
	thumbnailUrl: "", fileType: "", isPublished: false,
};

function ResourceFormPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = id === "new";

	const [form, setForm] = useState<FormData>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

	const query = useQuery({ ...orpc.admin.resources.getById.queryOptions({ input: { id } }), enabled: !isNew });

	useEffect(() => {
		if (query.data) {
			const d = query.data as typeof form & { category: string | null; fileType: string | null; thumbnailUrl: string | null; description: string | null };
			setForm({
				title: d.title,
				description: d.description ?? "",
				category: (d.category ?? "") as FormData["category"],
				fileUrl: d.fileUrl,
				thumbnailUrl: d.thumbnailUrl ?? "",
				fileType: (d.fileType ?? "") as FormData["fileType"],
				isPublished: d.isPublished,
			});
		}
	}, [query.data]);

	const invalidateList = () =>
		queryClient.invalidateQueries({ queryKey: orpc.admin.resources.list.queryOptions({ input: { page: 1, perPage: 10 } }).queryKey });

	const buildPayload = () => ({
		title: form.title,
		description: form.description || undefined,
		category: form.category || undefined,
		fileUrl: form.fileUrl,
		thumbnailUrl: form.thumbnailUrl || undefined,
		fileType: form.fileType || undefined,
		isPublished: form.isPublished,
	});

	const createMutation = useMutation({
		mutationFn: () => client.admin.resources.create(buildPayload()),
		onSuccess: () => { toast.success("Resource berhasil ditambahkan"); invalidateList(); navigate({ to: "/admin/resources" }); },
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: () => client.admin.resources.update({ id, ...buildPayload() }),
		onSuccess: () => { toast.success("Resource berhasil diperbarui"); invalidateList(); navigate({ to: "/admin/resources" }); },
		onError: (e: Error) => toast.error(e.message),
	});

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (form.title.trim().length < 3) e.title = "Minimal 3 karakter";
		if (!form.fileUrl) e.fileUrl = "URL file wajib diisi";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit() {
		if (!validate()) return;
		if (isNew) createMutation.mutate();
		else updateMutation.mutate();
	}

	const isSaving = createMutation.isPending || updateMutation.isPending;
	const isLoading = !isNew && query.isPending;

	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon-sm" onClick={() => navigate({ to: "/admin/resources" })}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-base font-semibold">{isNew ? "Tambah Resource" : "Edit Resource"}</h1>
				</div>
				<Button onClick={handleSubmit} disabled={isSaving || isLoading}>
					{isSaving ? "Menyimpan..." : "Simpan"}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-4 rounded-lg border p-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-1.5">
							<Skeleton className="h-3.5 w-24" />
							<Skeleton className="h-9 w-full" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Info Resource</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Judul <span className="text-destructive">*</span></label>
								<Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Worksheet Vocab Level 1..." />
								{errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Deskripsi</label>
								<Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="resize-none" placeholder="Deskripsi singkat..." />
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Kategori</label>
									<Select value={form.category} onValueChange={(v) => set("category", v as FormData["category"])}>
										<SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
										<SelectContent>
											<SelectItem value="">Tanpa kategori</SelectItem>
											<SelectItem value="worksheet">Worksheet</SelectItem>
											<SelectItem value="flashcard">Flashcard</SelectItem>
											<SelectItem value="template">Template</SelectItem>
											<SelectItem value="tips">Tips & Tricks</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Tipe File</label>
									<Select value={form.fileType} onValueChange={(v) => set("fileType", v as FormData["fileType"])}>
										<SelectTrigger><SelectValue placeholder="Pilih tipe..." /></SelectTrigger>
										<SelectContent>
											<SelectItem value="">Tidak diketahui</SelectItem>
											<SelectItem value="pdf">PDF</SelectItem>
											<SelectItem value="image">Image</SelectItem>
											<SelectItem value="zip">ZIP</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">File & Thumbnail</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">URL File <span className="text-destructive">*</span></label>
								<Input type="url" value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="https://..." />
								{errors.fileUrl && <p className="text-xs text-destructive">{errors.fileUrl}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">URL Thumbnail (opsional)</label>
								<Input type="url" value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://..." />
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-5">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Published</p>
								<p className="text-xs text-muted-foreground">Tampilkan di halaman Resources publik</p>
							</div>
							<Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
