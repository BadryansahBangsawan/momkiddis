import { createFileRoute, Link } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import {
	CLASS_SCHEDULES,
	PROGRAM_BONUSES,
	PROGRAM_CATEGORY_LABELS,
	PROGRAM_LIST,
} from "@/lib/programs-content";
import { useSiteConfig } from "@/hooks/use-site-config";
import { CalendarDays, Clock, Gift, Monitor, Star } from "lucide-react";

export const Route = createFileRoute("/jadwal")({
	head: () => ({
		meta: [{ title: "Jadwal Kelas — Momkiddis Indonesia" }],
	}),
	component: JadwalPage,
});

function JadwalPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			<PageHero
				title="Jadwal & Biaya Momkiddis Indonesia"
				subtitle="Jadwal dan biaya mengikuti program yang dipilih dan dapat dikonsultasikan dengan admin."
				breadcrumbs={[{ label: "Jadwal & Biaya" }]}
			/>

			<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-4">
					{PROGRAM_LIST.map((program) => (
						<div
							key={program.slug}
							className="overflow-hidden rounded-xl border border-border bg-card"
						>
							<div className="flex items-start justify-between gap-4 p-5">
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="text-sm font-semibold text-foreground">
											{program.shortTitle}
										</p>
										{program.isBestSeller && (
											<span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
												<Star className="size-3 fill-current" />
												Best Seller
											</span>
										)}
									</div>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{program.targetLabel}
									</p>
								</div>
								<span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
									{PROGRAM_CATEGORY_LABELS[program.category]}
								</span>
							</div>

							<div className="grid border-t border-border sm:grid-cols-3">
								<div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:border-b-0 sm:border-r">
									<Monitor className="size-3.5 shrink-0 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Format</p>
										<p className="text-xs font-medium text-foreground">
											{program.formatLabel}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:border-b-0 sm:border-r">
									<Clock className="size-3.5 shrink-0 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Durasi</p>
										<p className="text-xs font-medium text-foreground">
											{program.duration}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 px-4 py-3">
									<CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Informasi Biaya</p>
										<p className="text-xs font-medium text-foreground">
											{program.priceLabel}
										</p>
									</div>
								</div>
							</div>

							<div className="border-t border-border p-4">
								<div className="overflow-hidden rounded-lg border border-border">
									<table className="w-full border-collapse text-xs">
										<tbody>
											{program.pricePackages.map((pricePackage) => (
												<tr
													key={pricePackage.label}
													className="border-b border-border last:border-b-0"
												>
													<td className="border-r border-border px-3 py-2 text-muted-foreground">
														{pricePackage.label}
													</td>
													<td className="px-3 py-2 text-right font-semibold text-foreground">
														{pricePackage.price}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							<div className="border-t border-border px-5 py-3">
								<Link
									to="/programs/$slug"
									params={{ slug: program.slug }}
									className="text-xs font-medium text-primary hover:underline"
								>
									Lihat detail kelas →
								</Link>
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-2">
					<div className="rounded-xl border border-border bg-card p-5">
						<h2 className="text-sm font-semibold text-foreground">
							Jadwal Kelas
						</h2>
						<div className="mt-4 flex flex-col gap-2">
							{CLASS_SCHEDULES.map((schedule) => (
								<div
									key={schedule.session}
									className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
								>
									<span className="text-xs font-medium text-foreground">
										{schedule.session}
									</span>
									<span className="text-right text-xs text-muted-foreground">
										{schedule.time}
									</span>
								</div>
							))}
						</div>
						<p className="mt-3 text-xs leading-relaxed text-muted-foreground">
							Jadwal disesuaikan dengan kategori peserta dan program yang dipilih.
						</p>
					</div>

					<div className="rounded-xl border border-border bg-card p-5">
						<h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
							<Gift className="size-4 text-primary" />
							Bonus Free
						</h2>
						<ul className="mt-4 flex flex-col gap-2">
							{PROGRAM_BONUSES.map((bonus) => (
								<li key={bonus} className="flex items-start gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span className="text-xs leading-snug text-muted-foreground">
										{bonus}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
					<p className="text-xs font-semibold text-foreground">Catatan</p>
					<ul className="mt-2 flex flex-col gap-1.5">
						{[
							"Format kelas mengikuti ketentuan masing-masing program.",
							"Durasi dan jadwal dikonfirmasi bersama admin.",
							"Biaya dapat berbeda sesuai program dan kebutuhan peserta.",
							"Admin akan membantu memilih program yang paling sesuai.",
						].map((note) => (
							<li key={note} className="flex items-start gap-2">
								<span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
								<span className="text-xs text-muted-foreground">{note}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
					<p className="text-sm font-semibold text-foreground">
						Tanya jadwal dan biaya kelas
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Admin akan bantu pilih kelas dan sesi yang paling sesuai.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Chat Admin WhatsApp
					</a>
				</div>
			</div>
		</>
	);
}
