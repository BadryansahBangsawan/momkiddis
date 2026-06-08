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

export const Route = createFileRoute("/admin/promos/$id")({
	component: PromoFormPage,
});

interface FormData {
	title: string;
	description: string;
	programSlug: string;
	discountLabel: string;
	validFrom: string;
	validUntil: string;
	isActive: boolean;
}

const EMPTY: FormData = {
	title: "", description: "", programSlug: "", discountLabel: "",
	validFrom: "", validUntil: "", isActive: true,
};

const PROGRAM_OPTIONS = [
	{ label: "Momsky Class", value: "momsky-class" },
	{ label: "Kiddis Class", value: "kiddis-class" },
	{ label: "Teenager Class", value: "teenager-class" },
	{ label: "Professional Class", value: "professional-class" },
	{ label: "IELTS & TOEFL Class", value: "ielts-toefl-class" },
];

function toDateInput(d: Date | null | undefined): string {
	if (!d) return "";
	const dt = new Date(d);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

function PromoFormPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = id === "new";

	const [form, setForm] = useState<FormData>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

	const query = useQuery({ ...orpc.admin.promos.getById.queryOptions({ id }), enabled: !isNew });

	useEffect(() => {
		if (query.data) {
			const d = query.data as {
				title: string; description: string | null; programSlug: string | null;
				discountLabel: string | null; validFrom: Date | null; validUntil: Date | null; isActive: boolean;
			};
			setForm({
				title: d.title,
				description: d.description ?? "",
				programSlug: d.programSlug ?? "",
				discountLabel: d.discountLabel ?? "",
				validFrom: toDateInput(d.validFrom),
				validUntil: toDateInput(d.validUntil),
				isActive: d.isActive,
			});
		}
	}, [query.data]);

	const invalidateList = () =>
		queryClient.invalidateQueries({ queryKey: orpc.admin.promos.list.queryOptions({ page: 1, perPage: 10 }).queryKey });

	const buildPayload = () => ({
		title: form.title,
		description: form.description || undefined,
		programSlug: form.programSlug || undefined,
		discountLabel: form.discountLabel || undefined,
		validFrom: form.validFrom ? new Date(form.validFrom).getTime() : undefined,
		validUntil: form.validUntil ? new Date(form.validUntil).getTime() : undefined,
		isActive: form.isActive,
	});

	const createMutation = useMutation({
		mutationFn: () => client.admin.promos.create(buildPayload()),
		onSuccess: () => { toast.success("Promo berhasil ditambahkan"); invalidateList(); navigate({ to: "/admin/promos" }); },
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: () => client.admin.promos.update({ id, ...buildPayload() }),
		onSuccess: () => { toast.success("Promo berhasil diperbarui"); invalidateList(); navigate({ to: "/admin/promos" }); },
		onError: (e: Error) => toast.error(e.message),
	});

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (form.title.trim().length < 3) e.title = "Minimal 3 karakter";
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
					<Button variant="ghost" size="icon-sm" onClick={() => navigate({ to: "/admin/promos" })}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-base font-semibold">{isNew ? "Tambah Promo" : "Edit Promo"}</h1>
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
						<p className="mb-4 text-sm font-semibold">Info Promo</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Judul <span className="text-destructive">*</span></label>
								<Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Diskon 20% Momsky Class..." />
								{errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Deskripsi</label>
								<Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="resize-none" placeholder="Detail promo..." />
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Program (opsional)</label>
									<Select value={form.programSlug} onValueChange={(v) => set("programSlug", v ?? "")}>
										<SelectTrigger><SelectValue placeholder="Semua program..." /></SelectTrigger>
										<SelectContent>
											<SelectItem value="">Semua Program</SelectItem>
											{PROGRAM_OPTIONS.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Label Diskon</label>
									<Input value={form.discountLabel} onChange={(e) => set("discountLabel", e.target.value)} placeholder="Diskon 20% / Free Worksheet..." />
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Periode</p>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Berlaku Mulai</label>
								<Input type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Berlaku Sampai</label>
								<Input type="date" value={form.validUntil} onChange={(e) => set("validUntil", e.target.value)} />
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-5">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Aktif</p>
								<p className="text-xs text-muted-foreground">Tampilkan promo ini di halaman publik</p>
							</div>
							<Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
