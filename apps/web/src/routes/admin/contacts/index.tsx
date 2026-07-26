import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { orpc, client } from "@/utils/orpc";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Button } from "@momkiddis/ui/components/button";
import { Textarea } from "@momkiddis/ui/components/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@momkiddis/ui/components/sheet";
import { Separator } from "@momkiddis/ui/components/separator";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contacts/")({
	component: ContactsPage,
});

const STATUS_LABELS: Record<string, string> = {
	unread: "Belum Dibaca",
	read: "Sudah Dibaca",
	replied: "Sudah Dibalas",
	archived: "Diarsipkan",
};

const STATUS_COLORS: Record<string, string> = {
	unread: "bg-blue-500/10 text-blue-600",
	read: "bg-muted text-muted-foreground",
	replied: "bg-green-500/10 text-green-600",
	archived: "bg-muted text-muted-foreground",
};

interface ContactSubmission {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	subject: string;
	message: string;
	status: string;
	adminNotes: string | null;
	repliedAt: Date | null;
	createdAt: Date;
}

function StatusBadge({ status }: { status: string }) {
	return (
		<span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}>
			{STATUS_LABELS[status] ?? status}
		</span>
	);
}

function ContactsPage() {
	const queryClient = useQueryClient();

	const [filterValues, setFilterValues] = useState<Record<string, string>>({});
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [note, setNote] = useState("");

	const query = useQuery(
		orpc.admin.contacts.list.queryOptions({
			input: {
				page,
				perPage: 20,
				status: (filterValues.status as "unread" | "read" | "replied" | "archived") || undefined,
			},
		}),
	);

	const detailQuery = useQuery({
		...orpc.admin.contacts.getById.queryOptions({ input: { id: selectedId ?? "" } }),
		enabled: !!selectedId,
	});

	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: orpc.admin.contacts.list.key(),
		});

	const statusMutation = useMutation({
		mutationFn: (input: { id: string; status: "read" | "replied" | "archived" }) =>
			client.admin.contacts.updateStatus(input),
		onSuccess: () => {
			invalidate();
			queryClient.invalidateQueries({
				queryKey: orpc.admin.contacts.getById.queryOptions({ input: { id: selectedId ?? "" } }).queryKey,
			});
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const noteMutation = useMutation({
		mutationFn: (input: { id: string; note: string }) =>
			client.admin.contacts.addNote(input),
		onSuccess: () => {
			toast.success("Catatan disimpan");
			queryClient.invalidateQueries({
				queryKey: orpc.admin.contacts.getById.queryOptions({ input: { id: selectedId ?? "" } }).queryKey,
			});
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function openDetail(id: string) {
		setSelectedId(id);
		const current = items.find((item) => item.id === id);
		setNote(current?.adminNotes ?? "");
	}

	function closeDetail() {
		setSelectedId(null);
		setNote("");
		invalidate();
	}

	const columns: ColumnDef<ContactSubmission>[] = [
		{
			id: "name",
			header: "Pengirim",
			cell: ({ row }) => (
				<div>
					<p className="text-sm font-medium">{row.original.name}</p>
					<p className="text-xs text-muted-foreground">{row.original.email}</p>
				</div>
			),
		},
		{
			id: "subject",
			header: "Subjek",
			cell: ({ row }) => (
				<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
					{row.original.subject}
				</span>
			),
			size: 150,
		},
		{
			id: "message",
			header: "Pesan",
			cell: ({ row }) => (
				<p className="max-w-[260px] truncate text-sm text-muted-foreground">{row.original.message}</p>
			),
		},
		{
			id: "status",
			header: "Status",
			cell: ({ row }) => <StatusBadge status={row.original.status} />,
			size: 130,
		},
		{
			id: "date",
			header: "Tanggal",
			cell: ({ row }) => (
				<span className="text-xs text-muted-foreground">
					{new Date(row.original.createdAt).toLocaleDateString("id-ID", {
						day: "numeric", month: "short", year: "numeric",
					})}
				</span>
			),
			size: 110,
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => (
				<Button variant="ghost" size="icon-sm" onClick={() => openDetail(row.original.id)}>
					<MessageCircle className="h-4 w-4" />
				</Button>
			),
			size: 60,
		},
	];

	const items = (query.data as { items: ContactSubmission[]; total: number } | undefined)?.items ?? [];
	const total = (query.data as { items: ContactSubmission[]; total: number } | undefined)?.total ?? 0;
	const detail = detailQuery.data as ContactSubmission | undefined;

	return (
		<>
			<AdminDataTable
				columns={columns}
				data={items}
				isLoading={query.isPending}
				filters={[
					{
						key: "status",
						label: "Status",
						options: [
							{ label: "Belum Dibaca", value: "unread" },
							{ label: "Sudah Dibaca", value: "read" },
							{ label: "Sudah Dibalas", value: "replied" },
							{ label: "Diarsipkan", value: "archived" },
						],
					},
				]}
				filterValues={filterValues}
				onFilterChange={(k, v) => { setFilterValues((p) => ({ ...p, [k]: v })); setPage(1); }}
				page={page}
				perPage={20}
				total={total}
				onPageChange={setPage}
				emptyTitle="Belum ada pesan masuk"
				emptyDescription="Pesan dari form kontak akan muncul di sini."
			/>

			<Sheet open={!!selectedId} onOpenChange={(open) => !open && closeDetail()}>
				<SheetContent className="w-full sm:max-w-lg overflow-y-auto">
					{detail ? (
						<>
							<SheetHeader className="mb-4">
								<SheetTitle>{detail.subject}</SheetTitle>
							</SheetHeader>

							<div className="flex flex-col gap-4">
								{/* Pengirim */}
								<div className="rounded-lg bg-muted/40 p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-semibold">{detail.name}</p>
											<p className="text-xs text-muted-foreground">{detail.email}</p>
											{detail.phone && <p className="text-xs text-muted-foreground">{detail.phone}</p>}
										</div>
										<StatusBadge status={detail.status} />
									</div>
									<p className="mt-1 text-xs text-muted-foreground">
										{new Date(detail.createdAt).toLocaleString("id-ID")}
									</p>
								</div>

								{/* Pesan */}
								<div>
									<p className="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pesan</p>
									<p className="rounded-lg border bg-card p-4 text-sm leading-relaxed whitespace-pre-wrap">
										{detail.message}
									</p>
								</div>

								{/* WA Reply */}
								<a
									href={`https://wa.me/?text=${encodeURIComponent(`Halo ${detail.name}, terima kasih sudah menghubungi Momkiddis.`)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 px-4 py-2.5 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
								>
									<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
									</svg>
									Balas via WhatsApp
								</a>

								<Separator />

								{/* Actions status */}
								<div>
									<p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Ubah Status</p>
									<div className="flex flex-wrap gap-2">
										{detail.status !== "replied" && (
											<Button
												size="sm"
												variant="outline"
												disabled={statusMutation.isPending}
												onClick={() => statusMutation.mutate({ id: detail.id, status: "replied" })}
											>
												Tandai Sudah Dibalas
											</Button>
										)}
										{detail.status !== "archived" && (
											<Button
												size="sm"
												variant="outline"
												disabled={statusMutation.isPending}
												onClick={() => statusMutation.mutate({ id: detail.id, status: "archived" })}
											>
												Arsipkan
											</Button>
										)}
										{detail.status === "archived" && (
											<Button
												size="sm"
												variant="outline"
												disabled={statusMutation.isPending}
												onClick={() => statusMutation.mutate({ id: detail.id, status: "read" })}
											>
												Buka dari Arsip
											</Button>
										)}
									</div>
								</div>

								<Separator />

								{/* Admin notes */}
								<div>
									<p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Catatan Admin</p>
									<Textarea
										value={note}
										onChange={(e) => setNote(e.target.value)}
										rows={3}
										className="resize-none"
										placeholder="Catatan internal untuk pesan ini..."
									/>
									<Button
										size="sm"
										className="mt-2"
										disabled={noteMutation.isPending}
										onClick={() => noteMutation.mutate({ id: detail.id, note })}
									>
										{noteMutation.isPending ? "Menyimpan..." : "Simpan Catatan"}
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="flex h-full items-center justify-center">
							<p className="text-sm text-muted-foreground">Memuat pesan...</p>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
