import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Textarea } from "@momkiddis/ui/components/textarea";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { Separator } from "@momkiddis/ui/components/separator";
import { toast } from "sonner";
import {
	Globe,
	Phone,
	Mail,
	MapPin,
	Clock,
	User,
	Building2,
	Instagram,
	Youtube,
	Facebook,
	Music2,
} from "lucide-react";

export const Route = createFileRoute("/admin/site-config")({
	beforeLoad: ({ context }) => {
		const ctx = context as { isSuperAdmin?: boolean };
		if (!ctx.isSuperAdmin) {
			throw redirect({ to: "/admin" });
		}
	},
	component: SiteConfigPage,
});

interface ConfigRow {
	id: string;
	key: string;
	value: string;
	label: string;
	group: string;
	inputType: string;
}

const GROUP_META: Record<string, { label: string; description: string; icon: React.FC<{ className?: string }> }> = {
	general: {
		label: "Umum",
		description: "Informasi dasar lembaga",
		icon: ({ className }) => <Building2 className={className} />,
	},
	contact: {
		label: "Kontak",
		description: "Nomor WhatsApp, email, dan alamat",
		icon: ({ className }) => <Phone className={className} />,
	},
	social: {
		label: "Media Sosial",
		description: "Link akun media sosial",
		icon: ({ className }) => <Globe className={className} />,
	},
};

const KEY_ICON: Record<string, React.FC<{ className?: string }>> = {
	site_name: ({ className }) => <Building2 className={className} />,
	site_tagline: ({ className }) => <Globe className={className} />,
	founder_name: ({ className }) => <User className={className} />,
	whatsapp_number: ({ className }) => <Phone className={className} />,
	email: ({ className }) => <Mail className={className} />,
	address: ({ className }) => <MapPin className={className} />,
	operating_hours: ({ className }) => <Clock className={className} />,
	instagram_url: ({ className }) => <Instagram className={className} />,
	tiktok_url: ({ className }) => <Music2 className={className} />,
	youtube_url: ({ className }) => <Youtube className={className} />,
	facebook_url: ({ className }) => <Facebook className={className} />,
};

const GROUP_ORDER = ["general", "contact", "social"];

function SiteConfigPage() {
	const queryClient = useQueryClient();
	const query = useQuery(orpc.admin.siteConfig.getGrouped.queryOptions());

	const [values, setValues] = useState<Record<string, string>>({});
	const [dirty, setDirty] = useState(false);

	const rows = query.data as ConfigRow[] | undefined;

	// Sync from server on first load
	useEffect(() => {
		if (rows && !dirty) {
			const map: Record<string, string> = {};
			for (const r of rows) map[r.key] = r.value;
			setValues(map);
		}
	}, [rows, dirty]);

	const saveMutation = useMutation({
		mutationFn: (input: { key: string; value: string }[]) =>
			client.admin.siteConfig.update(input),
		onSuccess: () => {
			toast.success("Konfigurasi berhasil disimpan");
			setDirty(false);
			queryClient.invalidateQueries({
				queryKey: orpc.admin.siteConfig.getGrouped.queryOptions().queryKey,
			});
		},
		onError: (err: Error) => {
			toast.error(err.message ?? "Gagal menyimpan konfigurasi");
		},
	});

	function handleChange(key: string, val: string) {
		setValues((prev) => ({ ...prev, [key]: val }));
		setDirty(true);
	}

	function handleSave() {
		const payload = Object.entries(values).map(([key, value]) => ({ key, value }));
		saveMutation.mutate(payload);
	}

	const isLoading = query.isPending;
	const isSaving = saveMutation.isPending;

	// Group rows
	const grouped: Record<string, ConfigRow[]> = {};
	if (rows) {
		for (const row of rows) {
			if (!grouped[row.group]) grouped[row.group] = [];
			grouped[row.group].push(row);
		}
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<p className="text-sm text-muted-foreground">
					Edit konfigurasi website tanpa ubah kode. Perubahan langsung aktif setelah disimpan.
				</p>
				<Button
					onClick={handleSave}
					disabled={isSaving || isLoading || !dirty}
					className="shrink-0"
				>
					{isSaving ? "Menyimpan..." : "Simpan Perubahan"}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-lg border p-5">
							<Skeleton className="mb-4 h-5 w-28" />
							<div className="flex flex-col gap-3">
								{Array.from({ length: 3 }).map((_, j) => (
									<div key={j} className="flex flex-col gap-1">
										<Skeleton className="h-3.5 w-24" />
										<Skeleton className="h-9 w-full" />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{GROUP_ORDER.filter((g) => grouped[g]?.length).map((groupKey) => {
						const meta = GROUP_META[groupKey];
						const Icon = meta?.icon;
						const groupRows = grouped[groupKey];

						return (
							<div key={groupKey} className="rounded-lg border">
								{/* Group header */}
								<div className="flex items-center gap-3 border-b bg-muted/30 px-5 py-3.5">
									{Icon && (
										<div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
											<Icon className="size-3.5 text-primary" />
										</div>
									)}
									<div>
										<p className="text-sm font-semibold text-foreground">
											{meta?.label ?? groupKey}
										</p>
										{meta?.description && (
											<p className="text-xs text-muted-foreground">
												{meta.description}
											</p>
										)}
									</div>
								</div>

								{/* Fields */}
								<div className="divide-y">
									{groupRows.map((row) => {
										const FieldIcon = KEY_ICON[row.key];
										const val = values[row.key] ?? "";

										return (
											<div
												key={row.key}
												className="grid grid-cols-1 items-start gap-3 px-5 py-4 sm:grid-cols-[180px_1fr]"
											>
												{/* Label */}
												<div className="flex items-center gap-2 pt-0.5 sm:pt-2">
													{FieldIcon && (
														<FieldIcon className="size-3.5 shrink-0 text-muted-foreground" />
													)}
													<label
														htmlFor={row.key}
														className="text-sm font-medium text-foreground"
													>
														{row.label}
													</label>
												</div>

												{/* Input */}
												{row.inputType === "textarea" ? (
													<Textarea
														id={row.key}
														value={val}
														onChange={(e) => handleChange(row.key, e.target.value)}
														rows={3}
														className="resize-none text-sm"
														placeholder={`Masukkan ${row.label.toLowerCase()}...`}
													/>
												) : (
													<Input
														id={row.key}
														type={row.inputType}
														value={val}
														onChange={(e) => handleChange(row.key, e.target.value)}
														className="text-sm"
														placeholder={
															row.inputType === "url"
																? "https://..."
																: row.inputType === "tel"
																	? "62812345678..."
																	: `Masukkan ${row.label.toLowerCase()}...`
														}
													/>
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			)}

			<Separator />

			{/* Save footer */}
			<div className="flex justify-end">
				<Button
					onClick={handleSave}
					disabled={isSaving || isLoading || !dirty}
					size="lg"
				>
					{isSaving ? "Menyimpan..." : "Simpan Perubahan"}
				</Button>
			</div>
		</div>
	);
}
