import { createFileRoute, Link } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import { MessageSquare, CreditCard, Users, BookOpen, Award } from "lucide-react";

const STEPS = [
	{
		step: "01",
		icon: BookOpen,
		title: "Pilih Program",
		desc: "Pilih Momsky Class, Kiddis Class, Teenager Class, Professional Class, atau IELTS & TOEFL Class sesuai kebutuhanmu.",
		action: { label: "Lihat Semua Program", to: "/programs" as const },
	},
	{
		step: "02",
		icon: MessageSquare,
		title: "Hubungi Admin via WhatsApp",
		desc: "Chat admin kami untuk menanyakan jadwal batch terdekat, biaya, dan info program secara lengkap. Admin kami siap menjawab semua pertanyaan Anda.",
		action: null,
	},
	{
		step: "03",
		icon: CreditCard,
		title: "Konfirmasi Pembayaran",
		desc: "Lakukan pembayaran sesuai nominal yang diinfokan admin. Kirimkan bukti transfer via WhatsApp untuk konfirmasi. Tersedia via transfer bank maupun e-wallet.",
		action: null,
	},
	{
		step: "04",
		icon: Users,
		title: "Bergabung ke Grup Kelas",
		desc: "Setelah pembayaran dikonfirmasi, Anda akan dimasukkan ke grup WhatsApp kelas. Jadwal, link Zoom, dan materi persiapan akan dikirimkan melalui grup tersebut.",
		action: null,
	},
	{
		step: "05",
		icon: Award,
		title: "Ikuti Kelas & Raih Sertifikat",
		desc: "Ikuti semua sesi kelas dengan semangat. Selesaikan program dan dapatkan E-Certificate Momkiddis Indonesia sebagai bukti pencapaian kamu.",
		action: null,
	},
];

const FAQ_QUICK = [
	{
		q: "Apakah ada tes masuk?",
		a: "Tidak ada tes masuk. Semua program terbuka untuk siapa saja yang ingin belajar dan berkembang.",
	},
	{
		q: "Berapa lama proses pendaftaran?",
		a: "Sangat cepat — biasanya kurang dari satu hari setelah konfirmasi pembayaran diterima.",
	},
	{
		q: "Bisa daftar jika batch sudah penuh?",
		a: "Anda bisa masuk waitlist. Admin akan menghubungi ketika batch berikutnya dibuka.",
	},
	{
		q: "Apakah bisa cicil?",
		a: "Silakan tanyakan langsung ke admin — kebijakan pembayaran bisa berbeda per program.",
	},
];

export const Route = createFileRoute("/cara-daftar")({
	component: CaraDaftarPage,
});

function CaraDaftarPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			<PageHero
				title="Cara Mendaftar"
				subtitle="Proses pendaftaran yang simple — hanya 5 langkah dan Anda sudah siap belajar."
				breadcrumbs={[{ label: "Cara Mendaftar" }]}
			/>

			<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
				{/* Steps */}
				<section>
					<div className="space-y-0">
						{STEPS.map((s, i) => (
							<div key={s.step} className="flex gap-5">
								{/* Timeline */}
								<div className="flex flex-col items-center">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
										{s.step}
									</div>
									{i < STEPS.length - 1 && (
										<div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: "2rem" }} />
									)}
								</div>

								{/* Content */}
								<div className="pb-8 pt-1.5 min-w-0 flex-1">
									<div className="flex items-center gap-2.5">
										<s.icon className="size-4 text-primary" />
										<p className="text-sm font-semibold text-foreground">{s.title}</p>
									</div>
									<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
										{s.desc}
									</p>
									{s.action && (
										<Link
											to={s.action.to}
											className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
										>
											{s.action.label} →
										</Link>
									)}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Quick FAQ */}
				<section>
					<h2 className="mb-4 text-base font-semibold text-foreground">
						Pertanyaan Umum Pendaftaran
					</h2>
					<div className="grid gap-3 sm:grid-cols-2">
						{FAQ_QUICK.map((item) => (
							<div
								key={item.q}
								className="rounded-xl border border-border bg-card p-4"
							>
								<p className="text-sm font-medium text-foreground">{item.q}</p>
								<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
									{item.a}
								</p>
							</div>
						))}
					</div>
					<p className="mt-4 text-xs text-muted-foreground">
						Punya pertanyaan lain?{" "}
						<Link to="/faq" className="text-primary hover:underline">
							Lihat halaman FAQ
						</Link>{" "}
						atau hubungi admin langsung.
					</p>
				</section>

				{/* CTA */}
				<section className="rounded-2xl bg-primary px-8 py-10 text-center">
					<p className="text-lg font-bold text-white">Mulai Sekarang</p>
					<p className="mt-1 text-sm text-white/75">
						Langkah pertama dimulai dari satu chat. Hubungi admin kami via WhatsApp.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Chat Admin WhatsApp
					</a>
				</section>
			</div>
		</>
	);
}
