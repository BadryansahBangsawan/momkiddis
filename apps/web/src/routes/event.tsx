import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import PageHero from "@/components/sections/page-hero";
import WhatsAppCta from "@/components/sections/whatsapp-cta";
import { orpc } from "@/utils/orpc";
import { useSiteConfig } from "@/hooks/use-site-config";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

// Placeholder saat DB kosong
const PLACEHOLDER_UPCOMING = [
	{
		id: "1",
		title: "Workshop Microteaching Momsky Class",
		description: "Workshop praktik untuk para ibu yang ingin belajar teknik mengajar anak secara mudah, fun, dan terarah.",
		date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
		endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
		location: "Online via Zoom",
		type: "workshop",
		maxSeats: 20,
		waMessage: null as string | null,
	},
	{
		id: "2",
		title: "Webinar Gratis: Belajar Aktif Bersama Anak",
		description: "Webinar tentang cara membangun aktivitas belajar anak yang aktif, kreatif, dan menyenangkan di rumah.",
		date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		endDate: null as Date | null,
		location: "Online via Zoom",
		type: "webinar",
		maxSeats: 100,
		waMessage: null as string | null,
	},
];

const PLACEHOLDER_PAST = [
	{
		id: "p1",
		title: "Kelas Terbuka IELTS & TOEFL Class",
		date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
		location: "Online via Zoom",
		type: "kelas-terbuka",
	},
	{
		id: "p2",
		title: "Workshop Professional Class: Presentasi & Delivery",
		date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
		location: "Online via Zoom",
		type: "workshop",
	},
	{
		id: "p3",
		title: "Webinar Teenager Class: Percaya Diri Berkomunikasi",
		date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
		location: "Online via Zoom",
		type: "webinar",
	},
];

const TYPE_LABELS: Record<string, string> = {
	webinar: "Webinar",
	workshop: "Workshop",
	"kelas-terbuka": "Kelas Terbuka",
};

export const Route = createFileRoute("/event")({
	head: () => ({
		meta: [{ title: "Event — Momkiddis Indonesia" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.events.listUpcoming.queryOptions());
		void queryClient.prefetchQuery(orpc.events.listPast.queryOptions());
	},
	component: EventPage,
});

function formatEventDate(date: Date) {
	return new Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

function formatEventTime(date: Date) {
	return new Intl.DateTimeFormat("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Jakarta",
	}).format(date) + " WIB";
}

function EventPage() {
	const { instagram, getWaUrl } = useSiteConfig();
	const { data: upcoming = [] } = useQuery(orpc.events.listUpcoming.queryOptions());
	const { data: past = [] } = useQuery(orpc.events.listPast.queryOptions());

	const upcomingItems = upcoming.length > 0
		? upcoming.map((e) => ({ ...e, date: new Date(e.date), endDate: e.endDate ? new Date(e.endDate) : null }))
		: PLACEHOLDER_UPCOMING;
	const pastItems = past.length > 0
		? past.map((e) => ({ ...e, date: new Date(e.date) }))
		: PLACEHOLDER_PAST;

	return (
		<>
			<PageHero
				title="Event & Webinar"
				subtitle="Ikuti event, workshop, dan webinar untuk ibu, anak, remaja, profesional, serta peserta English test."
				breadcrumbs={[{ label: "Event" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Upcoming */}
				<section>
					<p className="text-xs font-semibold uppercase tracking-widest text-primary">
						Akan Datang
					</p>
					<h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
						Event Terdekat
					</h2>

					<div className="mt-6 grid gap-5 sm:grid-cols-2">
						{upcomingItems.map((event, i) => (
							<div
								key={event.id}
								className="flex flex-col rounded-xl border border-border bg-card overflow-hidden"
								style={{ animationDelay: `${i * 60}ms` }}
							>
								{/* Header bar */}
								<div className="flex items-center justify-between bg-primary/5 px-4 py-3 border-b border-border">
									<span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
										{TYPE_LABELS[event.type ?? ""] ?? event.type}
									</span>
									<span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
										Pendaftaran Buka
									</span>
								</div>

								<div className="flex flex-1 flex-col p-5">
									<h3 className="text-sm font-semibold leading-snug text-foreground">
										{event.title}
									</h3>
									{event.description && (
										<p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
											{event.description}
										</p>
									)}

									<div className="mt-4 space-y-1.5">
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<CalendarDays className="size-3.5 shrink-0 text-primary" />
											{formatEventDate(event.date)}
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<Clock className="size-3.5 shrink-0 text-primary" />
											{formatEventTime(event.date)}
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<MapPin className="size-3.5 shrink-0 text-primary" />
											{event.location ?? "TBA"}
										</div>
										{event.maxSeats && (
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<Users className="size-3.5 shrink-0 text-primary" />
												Maks. {event.maxSeats} peserta
											</div>
										)}
									</div>

									<div className="mt-5">
										<a
											href={getWaUrl(event.waMessage ?? `event ${event.title}`)}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity active:scale-[0.97] hover:opacity-90"
										>
											Daftar via WhatsApp
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Past Events */}
				<section className="mt-14">
					<p className="text-xs font-semibold uppercase tracking-widest text-primary">
						Sebelumnya
					</p>
					<h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
						Event yang Sudah Lewat
					</h2>

					<div className="mt-6 grid gap-3 sm:grid-cols-3">
						{pastItems.map((event, i) => (
							<div
								key={event.id}
								className="rounded-xl border border-border bg-card p-4 opacity-70"
								style={{ animationDelay: `${i * 40}ms` }}
							>
								<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
									{TYPE_LABELS[event.type ?? ""] ?? event.type}
								</span>
								<p className="mt-2 text-sm font-medium text-foreground line-clamp-2">
									{event.title}
								</p>
								<div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
									<CalendarDays className="size-3" />
									{formatEventDate(event.date)}
								</div>
								<div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
									<MapPin className="size-3" />
									{event.location ?? "—"}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Instagram CTA */}
				<div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
					<p className="text-sm font-semibold text-foreground">
						Jangan lewatkan event selanjutnya!
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Follow Instagram kami untuk update event, tips belajar bahasa Inggris, dan info kelas terbaru.
					</p>
					<a
						href={instagram}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-2 text-sm font-semibold text-pink-700 transition-opacity active:scale-[0.97] hover:opacity-80"
					>
						<svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
							<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
							<circle cx="17.5" cy="6.5" r="1" />
						</svg>
						@womenfu...2026
					</a>
				</div>

				<div className="mt-6">
					<WhatsAppCta variant="inline" label="Tanya info event via WhatsApp" />
				</div>
			</div>
		</>
	);
}
