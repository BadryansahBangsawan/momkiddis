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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events/$id")({
	component: EventFormPage,
});

interface FormData {
	title: string;
	description: string;
	date: string;
	endDate: string;
	location: string;
	type: "webinar" | "workshop" | "kelas-terbuka";
	imageUrl: string;
	isUpcoming: boolean;
	isPublished: boolean;
	maxSeats: string;
	waMessage: string;
}

const EMPTY: FormData = {
	title: "",
	description: "",
	date: "",
	endDate: "",
	location: "",
	type: "webinar",
	imageUrl: "",
	isUpcoming: true,
	isPublished: false,
	maxSeats: "",
	waMessage: "",
};

function toDatetimeLocal(d: Date | null | undefined): string {
	if (!d) return "";
	const dt = new Date(d);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function EventFormPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isNew = id === "new";

	const [form, setForm] = useState<FormData>(EMPTY);
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

	const query = useQuery({
		...orpc.admin.events.getById.queryOptions({ input: { id } }),
		enabled: !isNew,
	});

	useEffect(() => {
		if (query.data) {
			const d = query.data as {
				title: string; description: string | null; date: Date; endDate: Date | null;
				location: string | null; type: "webinar" | "workshop" | "kelas-terbuka";
				imageUrl: string | null; isUpcoming: boolean; isPublished: boolean;
				maxSeats: number | null; waMessage: string | null;
			};
			setForm({
				title: d.title,
				description: d.description ?? "",
				date: toDatetimeLocal(d.date),
				endDate: toDatetimeLocal(d.endDate),
				location: d.location ?? "",
				type: d.type,
				imageUrl: d.imageUrl ?? "",
				isUpcoming: d.isUpcoming,
				isPublished: d.isPublished,
				maxSeats: d.maxSeats ? String(d.maxSeats) : "",
				waMessage: d.waMessage ?? "",
			});
		}
	}, [query.data]);

	const invalidateList = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.events.list.queryOptions({ input: { page: 1, perPage: 10 } }).queryKey,
		});

	function buildPayload() {
		return {
			title: form.title,
			description: form.description || undefined,
			date: new Date(form.date).getTime(),
			endDate: form.endDate ? new Date(form.endDate).getTime() : undefined,
			location: form.location || undefined,
			type: form.type,
			imageUrl: form.imageUrl || undefined,
			isUpcoming: form.isUpcoming,
			isPublished: form.isPublished,
			maxSeats: form.maxSeats ? Number(form.maxSeats) : undefined,
			waMessage: form.waMessage || undefined,
		};
	}

	const createMutation = useMutation({
		mutationFn: () => client.admin.events.create(buildPayload()),
		onSuccess: () => {
			toast.success("Event berhasil ditambahkan");
			invalidateList();
			navigate({ to: "/admin/events/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const updateMutation = useMutation({
		mutationFn: () => client.admin.events.update({ id, ...buildPayload() }),
		onSuccess: () => {
			toast.success("Event berhasil diperbarui");
			invalidateList();
			navigate({ to: "/admin/events/" });
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function set<K extends keyof FormData>(key: K, value: FormData[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	function validate(): boolean {
		const e: Partial<Record<keyof FormData, string>> = {};
		if (form.title.trim().length < 5) e.title = "Minimal 5 karakter";
		if (!form.date) e.date = "Tanggal wajib diisi";
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
					<Button variant="ghost" size="icon-sm" onClick={() => navigate({ to: "/admin/events/" })}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-base font-semibold">{isNew ? "Tambah Event" : "Edit Event"}</h1>
				</div>
				<Button onClick={handleSubmit} disabled={isSaving || isLoading}>
					{isSaving ? "Menyimpan..." : "Simpan"}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-4 rounded-lg border p-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-1.5">
							<Skeleton className="h-3.5 w-24" />
							<Skeleton className="h-9 w-full" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{/* Info dasar */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Info Event</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Judul <span className="text-destructive">*</span></label>
								<Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Workshop Microteaching..." />
								{errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Deskripsi</label>
								<Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="resize-none" placeholder="Deskripsi singkat event..." />
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Tipe Event</label>
									<Select value={form.type} onValueChange={(v) => set("type", v as FormData["type"])}>
										<SelectTrigger><SelectValue /></SelectTrigger>
										<SelectContent>
											<SelectItem value="webinar">Webinar</SelectItem>
											<SelectItem value="workshop">Workshop</SelectItem>
											<SelectItem value="kelas-terbuka">Kelas Terbuka</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-medium">Lokasi</label>
									<Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Online via Zoom / Alamat..." />
								</div>
							</div>
						</div>
					</div>

					{/* Waktu */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Waktu</p>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Tanggal Mulai <span className="text-destructive">*</span></label>
								<Input type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)} />
								{errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Tanggal Selesai (opsional)</label>
								<Input type="datetime-local" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
							</div>
						</div>
					</div>

					{/* Detail tambahan */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Detail Tambahan</p>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Gambar (URL, opsional)</label>
								<Input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Maks. Peserta</label>
								<Input type="number" min={1} value={form.maxSeats} onChange={(e) => set("maxSeats", e.target.value)} placeholder="20" />
							</div>
						</div>
						<div className="mt-4 flex flex-col gap-1.5">
							<label className="text-sm font-medium">Pesan WA Custom (opsional)</label>
							<Input value={form.waMessage} onChange={(e) => set("waMessage", e.target.value)} placeholder="Pesan otomatis saat klik tombol daftar..." />
						</div>
					</div>

					{/* Visibilitas */}
					<div className="rounded-lg border p-5">
						<p className="mb-4 text-sm font-semibold">Visibilitas</p>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Akan Datang</p>
									<p className="text-xs text-muted-foreground">Tampil di bagian "Upcoming Events"</p>
								</div>
								<Switch checked={form.isUpcoming} onCheckedChange={(v) => set("isUpcoming", v)} />
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Published</p>
									<p className="text-xs text-muted-foreground">Tampilkan di halaman publik</p>
								</div>
								<Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
