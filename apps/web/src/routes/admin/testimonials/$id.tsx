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
import { Separator } from "@momkiddis/ui/components/separator";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials/$id")({
	component: TestimonialFormPage,
});

const PROGRAM_OPTIONS = [
	{ label: "Momsky Class", value: "momsky-class" },
	{ label: "Kiddis Class", value: "kiddis-class" },
	{ label: "Teenager Class", value: "teenager-class" },
	{ label: "Professional Class", value: "professional-class" },
	{ label: "IELTS & TOEFL Class", value: "ielts-toefl-class" },
];

interface FormData {
	authorName: string;
	authorRole: string;
	authorImage: string;
	programSlug: string;
	content: string;
	rating: number;
	isPublished: boolean;
	isFeatured: boolean;
}

const EMPTY: FormData = {
	authorName: "",
	authorRole: "",
	authorImage: "",
	programSlug: "",
	content: "",
	rating: 5,
	isPublished: false,
	isFeatured: false,
};

function TestimonialFormPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = id === "new";

	const [form, setForm] = useState<FormData>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

	const query = useQuery({
		...orpc.admin.testimonials.getById.queryOptions({ input: { id } }),
		enabled: !isNew,
	});

	// Sync form from server data
	useEffect(() => {
		if (query.data) {
			const d = query.data as FormData & { programSlug: string | null; authorImage: string | null };
			setForm({
				authorName: d.authorName ?? "",
				authorRole: d.authorRole ?? "",
				authorImage: d.authorImage ?? "",
				programSlug: d.programSlug ?? "",
				content: d.content ?? "",
				rating: d.rating ?? 5,
				isPublished: d.isPublished ?? false,
				isFeatured: d.isFeatured ?? false,
			});
		}
	}, [query.data]);

	const invalidateList = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.testimonials.list.queryOptions({ input: { page: 1, perPage: 10 } }).queryKey,
		});

	const createMutation = useMutation({
		mutationFn: (data: FormData) =>
			client.admin.testimonials.create({
				...data,
				authorImage: data.authorImage || undefined,
				programSlug: data.programSlug || undefined,
			}),
		onSuccess: () => {
			toast.success("Testimoni berhasil ditambahkan");
			invalidateList();
			navigate({ to: "/admin/testimonials/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: (data: FormData) =>
			client.admin.testimonials.update({
				id,
				...data,
				authorImage: data.authorImage || undefined,
				programSlug: data.programSlug || undefined,
			}),
		onSuccess: () => {
			toast.success("Testimoni berhasil diperbarui");
			invalidateList();
			navigate({ to: "/admin/testimonials/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (form.authorName.trim().length < 2) e.authorName = "Minimal 2 karakter";
		if (form.authorRole.trim().length < 2) e.authorRole = "Minimal 2 karakter";
		if (form.content.trim().length < 10) e.content = "Minimal 10 karakter";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit() {
		if (!validate()) return;
		if (isNew) createMutation.mutate(form);
		else updateMutation.mutate(form);
	}

	const isSaving = createMutation.isPending || updateMutation.isPending;
	const isLoading = !isNew && query.isPending;

	return (
		<div className="mx-auto max-w-2xl">
			{/* Header */}
			<div className="mb-6 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => navigate({ to: "/admin/testimonials/" })}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-base font-semibold">
						{isNew ? "Tambah Testimoni" : "Edit Testimoni"}
					</h1>
				</div>
				<Button onClick={handleSubmit} disabled={isSaving || isLoading}>
					{isSaving ? "Menyimpan..." : "Simpan"}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-4 rounded-lg border p-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-1.5">
							<Skeleton className="h-3.5 w-24" />
							<Skeleton className="h-9 w-full" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{/* Identitas penulis */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold text-foreground">Identitas Penulis</p>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Nama <span className="text-destructive">*</span>
								</label>
								<Input
									value={form.authorName}
									onChange={(e) => set("authorName", e.target.value)}
									placeholder="Bu Rina Kusuma"
								/>
								{errors.authorName && (
									<p className="text-xs text-destructive">{errors.authorName}</p>
								)}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Role / Posisi <span className="text-destructive">*</span>
								</label>
								<Input
									value={form.authorRole}
									onChange={(e) => set("authorRole", e.target.value)}
									placeholder="Peserta Batch 3"
								/>
								{errors.authorRole && (
									<p className="text-xs text-destructive">{errors.authorRole}</p>
								)}
							</div>
						</div>
						<div className="mt-4 flex flex-col gap-1.5">
							<label className="text-sm font-medium">Foto (URL, opsional)</label>
							<Input
								value={form.authorImage}
								onChange={(e) => set("authorImage", e.target.value)}
								placeholder="https://..."
								type="url"
							/>
						</div>
					</div>

					{/* Konten */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold text-foreground">Konten</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Program</label>
								<Select
									value={form.programSlug || ""}
									onValueChange={(val) => set("programSlug", val)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Pilih program..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">Tidak terkait program</SelectItem>
										{PROGRAM_OPTIONS.map((p) => (
											<SelectItem key={p.value} value={p.value}>
												{p.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Isi Testimoni <span className="text-destructive">*</span>
								</label>
								<Textarea
									value={form.content}
									onChange={(e) => set("content", e.target.value)}
									placeholder="Tulis isi testimoni..."
									rows={4}
									className="resize-none"
								/>
								<p className="text-right text-xs text-muted-foreground">
									{form.content.length}/1000
								</p>
								{errors.content && (
									<p className="text-xs text-destructive">{errors.content}</p>
								)}
							</div>

							{/* Rating */}
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Rating</label>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => set("rating", star)}
											className="transition-transform hover:scale-110"
										>
											<Star
												className={`h-6 w-6 ${star <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
											/>
										</button>
									))}
									<span className="ml-2 self-center text-sm text-muted-foreground">
										{form.rating}/5
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Visibilitas */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold text-foreground">Visibilitas</p>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Published</p>
									<p className="text-xs text-muted-foreground">
										Tampilkan di halaman testimoni publik
									</p>
								</div>
								<Switch
									checked={form.isPublished}
									onCheckedChange={(val) => set("isPublished", val)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Featured</p>
									<p className="text-xs text-muted-foreground">
										Tampilkan di beranda / halaman utama
									</p>
								</div>
								<Switch
									checked={form.isFeatured}
									onCheckedChange={(val) => set("isFeatured", val)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
