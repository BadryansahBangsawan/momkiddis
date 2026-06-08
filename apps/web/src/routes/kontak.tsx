import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/utils/orpc";
import PageHero from "@/components/sections/page-hero";
import { siteConfig } from "@/lib/site-config";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Textarea } from "@momkiddis/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@momkiddis/ui/components/select";
import { MapPin, Clock, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/kontak")({
	component: KontakPage,
});

interface ContactForm {
	name: string;
	email: string;
	phone: string;
	subject: "Tanya Program" | "Pendaftaran" | "Kerjasama" | "Lainnya" | "";
	message: string;
}

const EMPTY_FORM: ContactForm = { name: "", email: "", phone: "", subject: "", message: "" };

function KontakPage() {
	const { instagram, getWaUrl, raw } = useSiteConfig();
	const waUrl = getWaUrl();
	const address = raw?.address ?? siteConfig.address;
	const operationalHours = raw?.operating_hours ?? siteConfig.operationalHours;

	const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
	const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

	function setField<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
		setForm((p) => ({ ...p, [key]: value }));
		if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
	}

	const submitMutation = useMutation({
		mutationFn: (input: { name: string; email: string; phone?: string; subject: "Tanya Program" | "Pendaftaran" | "Kerjasama" | "Lainnya"; message: string }) =>
			client.contacts.submit(input),
		onSuccess: () => {
			toast.success("Pesan terkirim! Kami akan segera menghubungi Anda.");
			setForm(EMPTY_FORM);
			setErrors({});
		},
		onError: (e: Error) => toast.error(e.message),
	});

	function validateForm(): boolean {
		const e: Partial<Record<keyof ContactForm, string>> = {};
		if (form.name.trim().length < 2) e.name = "Nama minimal 2 karakter";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email tidak valid";
		if (!form.subject) e.subject = "Pilih subjek pesan";
		if (form.message.trim().length < 10) e.message = "Pesan minimal 10 karakter";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validateForm()) return;
		submitMutation.mutate({
			name: form.name,
			email: form.email,
			phone: form.phone || undefined,
			subject: form.subject as "Tanya Program" | "Pendaftaran" | "Kerjasama" | "Lainnya",
			message: form.message,
		});
	}

	return (
		<>
			<PageHero
				title="Kontak Kami"
				subtitle="Ada pertanyaan atau ingin mendaftar? Kami senang mendengar dari Anda."
				breadcrumbs={[{ label: "Kontak" }]}
			/>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-6 sm:grid-cols-2">
					{/* WhatsApp */}
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-150 hover:border-[#25D366]/40 hover:shadow-sm active:scale-[0.98]"
					>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-5 text-[#25D366]"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">
								WhatsApp Admin
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Chat langsung untuk info program, jadwal, dan pendaftaran
							</p>
							<span className="mt-2 inline-block text-xs font-medium text-[#25D366] group-hover:underline">
								Buka WhatsApp →
							</span>
						</div>
					</a>

					{/* Instagram */}
					{instagram && (
						<a
							href={instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-150 hover:border-pink-300/40 hover:shadow-sm active:scale-[0.98]"
						>
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5 text-pink-600">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-foreground">Instagram</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									Ikuti untuk konten parenting dan info program terbaru
								</p>
								<span className="mt-2 inline-block text-xs font-medium text-pink-600 group-hover:underline">
									@momkiddy.education →
								</span>
							</div>
						</a>
					)}

					{/* Alamat */}
					<div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
							<MapPin className="size-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">Lokasi</p>
							<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
								{address}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Tersedia kelas online via Zoom untuk peserta dari seluruh Indonesia.
							</p>
						</div>
					</div>

					{/* Jam operasional */}
					<div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
							<Clock className="size-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">
								Jam Operasional
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{operationalHours}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Di luar jam tersebut, pesan WhatsApp akan kami balas pada hari
								kerja berikutnya.
							</p>
						</div>
					</div>
				</div>

				{/* Form Kontak */}
				<div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8">
					<h2 className="mb-1 text-base font-semibold">Kirim Pesan</h2>
					<p className="mb-6 text-sm text-muted-foreground">Isi form berikut dan kami akan menghubungi Anda secepatnya.</p>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Nama <span className="text-destructive">*</span></label>
								<Input
									value={form.name}
									onChange={(e) => setField("name", e.target.value)}
									placeholder="Nama lengkap..."
								/>
								{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
								<Input
									type="email"
									value={form.email}
									onChange={(e) => setField("email", e.target.value)}
									placeholder="email@contoh.com"
								/>
								{errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">No. WhatsApp (opsional)</label>
								<Input
									type="tel"
									value={form.phone}
									onChange={(e) => setField("phone", e.target.value)}
									placeholder="08xx-xxxx-xxxx"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Subjek <span className="text-destructive">*</span></label>
								<Select value={form.subject} onValueChange={(v) => setField("subject", v as ContactForm["subject"])}>
									<SelectTrigger><SelectValue placeholder="Pilih subjek..." /></SelectTrigger>
									<SelectContent>
										<SelectItem value="Tanya Program">Tanya Program</SelectItem>
										<SelectItem value="Pendaftaran">Pendaftaran</SelectItem>
										<SelectItem value="Kerjasama">Kerjasama</SelectItem>
										<SelectItem value="Lainnya">Lainnya</SelectItem>
									</SelectContent>
								</Select>
								{errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Pesan <span className="text-destructive">*</span></label>
							<Textarea
								value={form.message}
								onChange={(e) => setField("message", e.target.value)}
								rows={4}
								className="resize-none"
								placeholder="Tulis pesan Anda di sini..."
							/>
							{errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
						</div>
						<Button type="submit" disabled={submitMutation.isPending} className="self-start">
							{submitMutation.isPending ? "Mengirim..." : "Kirim Pesan"}
						</Button>
					</form>
				</div>

				{/* CTA banner */}
				<div className="mt-10 rounded-2xl bg-primary px-8 py-10 text-center">
					<Phone className="mx-auto mb-3 size-8 text-white/80" />
					<h2 className="text-lg font-bold text-white">
						Siap mendaftar? Hubungi kami sekarang
					</h2>
					<p className="mt-1 text-sm text-white/70">
						Admin kami siap menjawab pertanyaan dan membantu proses pendaftaran.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#25D366]">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						Chat WhatsApp Admin
					</a>
				</div>
			</div>
		</>
	);
}
