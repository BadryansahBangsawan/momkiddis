import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Textarea } from "@momkiddis/ui/components/textarea";
import { Switch } from "@momkiddis/ui/components/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@momkiddis/ui/components/select";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { Separator } from "@momkiddis/ui/components/separator";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/alumni/$id")({
	component: AlumniFormPage,
});

const PROGRAM_OPTIONS = [
	{ label: "Momsky Class", value: "momsky-class" },
	{ label: "Kiddis Class", value: "kiddis-class" },
	{ label: "Teenager Class", value: "teenager-class" },
	{ label: "Professional Class", value: "professional-class" },
	{ label: "IELTS & TOEFL Class", value: "ielts-toefl-class" },
];

interface FormData {
	name: string;
	photo: string;
	batchLabel: string;
	programSlug: string;
	certificateUrl: string;
	shortStory: string;
	graduatedAt: string; // "YYYY-MM-DD" untuk date input
	isPublished: boolean;
	isFeatured: boolean;
}

const EMPTY: FormData = {
	name: "",
	photo: "",
	batchLabel: "",
	programSlug: "",
	certificateUrl: "",
	shortStory: "",
	graduatedAt: "",
	isPublished: false,
	isFeatured: false,
};

function toDateString(ts: number | Date | null | undefined): string {
	if (!ts) return "";
	const d = new Date(ts);
	return d.toISOString().split("T")[0];
}

function AlumniFormPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = id === "new";

	const [form, setForm] = useState<FormData>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

	const query = useQuery({
		...orpc.admin.alumni.getById.queryOptions({ input: { id } }),
		enabled: !isNew,
	});

	useEffect(() => {
		if (query.data) {
			const d = query.data as FormData & {
				graduatedAt: Date | number;
				photo: string | null;
				certificateUrl: string | null;
			};
			setForm({
				name: d.name ?? "",
				photo: d.photo ?? "",
				batchLabel: d.batchLabel ?? "",
				programSlug: d.programSlug ?? "",
				certificateUrl: d.certificateUrl ?? "",
				shortStory: d.shortStory ?? "",
				graduatedAt: toDateString(d.graduatedAt),
				isPublished: d.isPublished ?? false,
				isFeatured: d.isFeatured ?? false,
			});
		}
	}, [query.data]);

	const invalidateList = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.alumni.list.queryOptions({ input: { page: 1, perPage: 10 } }).queryKey,
		});

	const createMutation = useMutation({
		mutationFn: (data: FormData) =>
			client.admin.alumni.create({
				name: data.name,
				photo: data.photo || undefined,
				batchLabel: data.batchLabel,
				programSlug: data.programSlug,
				certificateUrl: data.certificateUrl || undefined,
				shortStory: data.shortStory,
				graduatedAt: new Date(data.graduatedAt).getTime(),
				isPublished: data.isPublished,
				isFeatured: data.isFeatured,
			}),
		onSuccess: () => {
			toast.success("Alumni berhasil ditambahkan");
			invalidateList();
			navigate({ to: "/admin/alumni/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: (data: FormData) =>
			client.admin.alumni.update({
				id,
				name: data.name,
				photo: data.photo || undefined,
				batchLabel: data.batchLabel,
				programSlug: data.programSlug,
				certificateUrl: data.certificateUrl || undefined,
				shortStory: data.shortStory,
				graduatedAt: new Date(data.graduatedAt).getTime(),
				isPublished: data.isPublished,
				isFeatured: data.isFeatured,
			}),
		onSuccess: () => {
			toast.success("Alumni berhasil diperbarui");
			invalidateList();
			navigate({ to: "/admin/alumni/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (form.name.trim().length < 2) e.name = "Minimal 2 karakter";
		if (form.batchLabel.trim().length < 2) e.batchLabel = "Minimal 2 karakter";
		if (!form.programSlug) e.programSlug = "Pilih program";
		if (form.shortStory.trim().length < 10) e.shortStory = "Minimal 10 karakter";
		if (!form.graduatedAt) e.graduatedAt = "Tanggal lulus wajib diisi";
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
						onClick={() => navigate({ to: "/admin/alumni/" })}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-base font-semibold">
						{isNew ? "Tambah Alumni" : "Edit Alumni"}
					</h1>
				</div>
				<Button onClick={handleSubmit} disabled={isSaving || isLoading}>
					{isSaving ? "Menyimpan..." : "Simpan"}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-4 rounded-lg border p-6">
					{Array.from({ length: 7 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-1.5">
							<Skeleton className="h-3.5 w-24" />
							<Skeleton className="h-9 w-full" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{/* Identitas */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold text-foreground">Identitas Alumni</p>
						<div className="flex flex-col gap-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">
										Nama <span className="text-destructive">*</span>
									</label>
									<Input
										value={form.name}
										onChange={(e) => set("name", e.target.value)}
										placeholder="Bu Rina Kusuma"
									/>
									{errors.name && (
										<p className="text-xs text-destructive">{errors.name}</p>
									)}
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">
										Batch <span className="text-destructive">*</span>
									</label>
									<Input
										value={form.batchLabel}
										onChange={(e) => set("batchLabel", e.target.value)}
										placeholder="Batch 5, Maret 2025"
									/>
									{errors.batchLabel && (
										<p className="text-xs text-destructive">{errors.batchLabel}</p>
									)}
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">
										Program <span className="text-destructive">*</span>
									</label>
									<Select
										value={form.programSlug}
										onValueChange={(val) => set("programSlug", val)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Pilih program..." />
										</SelectTrigger>
										<SelectContent>
											{PROGRAM_OPTIONS.map((p) => (
												<SelectItem key={p.value} value={p.value}>
													{p.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.programSlug && (
										<p className="text-xs text-destructive">{errors.programSlug}</p>
									)}
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">
										Tanggal Lulus <span className="text-destructive">*</span>
									</label>
									<Input
										type="date"
										value={form.graduatedAt}
										onChange={(e) => set("graduatedAt", e.target.value)}
									/>
									{errors.graduatedAt && (
										<p className="text-xs text-destructive">{errors.graduatedAt}</p>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Foto (URL, opsional)</label>
								<Input
									value={form.photo}
									onChange={(e) => set("photo", e.target.value)}
									placeholder="https://..."
									type="url"
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Link Sertifikat (opsional)
								</label>
								<Input
									value={form.certificateUrl}
									onChange={(e) => set("certificateUrl", e.target.value)}
									placeholder="https://..."
									type="url"
								/>
							</div>
						</div>
					</div>

					{/* Cerita */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold text-foreground">Cerita Singkat</p>
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">
								Cerita <span className="text-destructive">*</span>
							</label>
							<Textarea
								value={form.shortStory}
								onChange={(e) => set("shortStory", e.target.value)}
								placeholder="Tuliskan cerita singkat perjalanan alumni ini..."
								rows={4}
								className="resize-none"
							/>
							<p className="text-right text-xs text-muted-foreground">
								{form.shortStory.length}/500
							</p>
							{errors.shortStory && (
								<p className="text-xs text-destructive">{errors.shortStory}</p>
							)}
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
										Tampilkan di halaman alumni publik
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
										Tampilkan di slider beranda
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
