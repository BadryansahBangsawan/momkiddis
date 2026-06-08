import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import PageHero from "@/components/sections/page-hero";
import WhatsAppCta from "@/components/sections/whatsapp-cta";
import { orpc } from "@/utils/orpc";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Tag, CalendarDays, Sparkles } from "lucide-react";

// Placeholder saat DB kosong
const PLACEHOLDER_PROMOS = [
	{
		id: "1",
		title: "Early Bird Momkiddis Indonesia",
		description:
			"Daftar lebih awal untuk kelas Momkiddis Indonesia dan konsultasikan paket belajar terbaik dengan admin.",
		programSlug: "momsky-class" as string | null,
		discountLabel: "Diskon 20%",
		validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) as Date | null,
	},
	{
		id: "2",
		title: "Program Keluarga Momkiddis",
		description:
			"Konsultasikan kombinasi program untuk ibu, anak, atau remaja sesuai kebutuhan keluarga.",
		programSlug: null,
		discountLabel: "Bonus Konsultasi",
		validUntil: null,
	},
	{
		id: "3",
		title: "Referral Program",
		description:
			"Ajak teman bergabung di kelas Momkiddis dan tanyakan bonus referral yang sedang aktif.",
		programSlug: null,
		discountLabel: "Bonus Referral",
		validUntil: null,
	},
];

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(d);
}

export const Route = createFileRoute("/promo")({
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.promos.listActive.queryOptions());
	},
	component: PromoPage,
});

function PromoPage() {
	const { getWaUrl } = useSiteConfig();
	const { data = [] } = useQuery(orpc.promos.listActive.queryOptions());

	const items = data.length > 0
		? data.map((p) => ({
				...p,
				validUntil: p.validUntil ? new Date(p.validUntil) : null,
		  }))
		: PLACEHOLDER_PROMOS;
	const isLive = data.length > 0;

	return (
		<>
			<PageHero
				title="Promo & Penawaran"
				subtitle="Dapatkan penawaran terbaik untuk kelas Momkiddis Indonesia."
				breadcrumbs={[{ label: "Promo" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Promo grid */}
				{items.length === 0 ? (
					<div className="py-20 text-center">
						<div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-accent/10">
							<Sparkles className="size-8 text-accent" />
						</div>
						<p className="mt-4 text-sm font-semibold text-foreground">
							Belum ada promo aktif saat ini
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Pantau halaman ini untuk penawaran spesial berikutnya.
						</p>
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((promo, i) => (
							<div
								key={promo.id}
								className="flex flex-col rounded-xl border border-border bg-card overflow-hidden"
								style={{ animationDelay: `${i * 60}ms` }}
							>
								{/* Accent top bar */}
								<div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

								<div className="flex flex-1 flex-col p-5">
									{/* Badge */}
									<div className="flex items-center gap-1.5">
										<Tag className="size-3.5 text-accent" />
										<span className="text-xs font-bold text-accent">
											{promo.discountLabel}
										</span>
									</div>

									<h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
										{promo.title}
									</h3>

									{promo.description && (
										<p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
											{promo.description}
										</p>
									)}

									{/* Meta */}
									<div className="mt-4 space-y-1">
										{promo.programSlug && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
													{promo.programSlug}
												</span>
											</div>
										)}
										{promo.validUntil && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<CalendarDays className="size-3.5" />
												Berlaku hingga {formatDate(promo.validUntil)}
											</div>
										)}
										{!promo.validUntil && (
											<div className="text-xs text-muted-foreground">
												Berlaku sampai pemberitahuan lebih lanjut
											</div>
										)}
									</div>

									<div className="mt-4">
										<a
											href={getWaUrl(`promo ${promo.title}`)}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-opacity active:scale-[0.97] hover:opacity-90"
										>
											Klaim via WhatsApp
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{!isLive && (
					<p className="mt-6 text-center text-xs text-muted-foreground">
						Promo di atas adalah contoh penawaran yang biasa tersedia. Hubungi kami untuk info promo terkini.
					</p>
				)}

				{/* CTA */}
				<div className="mt-10">
					<WhatsAppCta variant="full" label="Tanya promo terbaru via WhatsApp" />
				</div>
			</div>
		</>
	);
}
