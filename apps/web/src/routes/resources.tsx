import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHero from "@/components/sections/page-hero";
import WhatsAppCta from "@/components/sections/whatsapp-cta";
import { orpc } from "@/utils/orpc";
import { FileText, Image, Archive, Download, BookOpen } from "lucide-react";

type Category = "semua" | "worksheet" | "flashcard" | "template" | "tips";

const CATEGORIES: { id: Category; label: string }[] = [
	{ id: "semua", label: "Semua" },
	{ id: "worksheet", label: "Worksheet" },
	{ id: "flashcard", label: "Flashcard" },
	{ id: "template", label: "Template" },
	{ id: "tips", label: "Tips & Panduan" },
];

// Placeholder saat DB kosong
const PLACEHOLDER_RESOURCES = [
	{
		id: "1",
		title: "Vocabulary List: 200 Kata Percakapan Harian",
		description: "Daftar 200 kata dan frasa bahasa Inggris yang paling sering dipakai dalam percakapan sehari-hari. Cocok untuk pemula speaking.",
		category: "worksheet",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
	{
		id: "2",
		title: "Flashcard: 100 Phrasal Verbs Paling Umum",
		description: "Kartu belajar phrasal verb dengan contoh kalimat. Cocok untuk latihan English Fun dan komunikasi.",
		category: "flashcard",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
	{
		id: "3",
		title: "Template: IELTS Writing Task 2 Outline",
		description: "Template struktur jawaban IELTS Writing Task 2 yang bisa langsung dipakai untuk latihan. Dilengkapi contoh essay band 7.",
		category: "template",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
	{
		id: "4",
		title: "Panduan: 10 Tips Mulai Speaking Inggris dari Nol",
		description: "Panduan PDF berisi 10 strategi praktis untuk pemula yang ingin mulai berani berbicara bahasa Inggris tanpa rasa takut salah.",
		category: "tips",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
	{
		id: "5",
		title: "TOEFL Structure Practice: 50 Soal Latihan",
		description: "Kumpulan 50 soal latihan TOEFL structure & grammar dengan kunci jawaban dan penjelasan. Cocok untuk persiapan CPNS dan kampus.",
		category: "worksheet",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
	{
		id: "6",
		title: "Template: Jadwal Belajar Bahasa Inggris Mingguan",
		description: "Template jadwal belajar bahasa Inggris yang bisa diisi sendiri, membantu peserta belajar lebih konsisten dan terstruktur.",
		category: "template",
		fileType: "pdf",
		downloadCount: 0,
		fileUrl: "#",
	},
];

function FileTypeIcon({ type }: { type: string | null | undefined }) {
	if (type === "image") return <Image className="size-6 text-primary/40" />;
	if (type === "zip") return <Archive className="size-6 text-primary/40" />;
	return <FileText className="size-6 text-primary/40" />;
}

export const Route = createFileRoute("/resources")({
	head: () => ({
		meta: [{ title: "Resources — Momkiddis Indonesia" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.resources.list.queryOptions());
	},
	component: ResourcesPage,
});

function ResourcesPage() {
	const [activeCategory, setActiveCategory] = useState<Category>("semua");
	const { data = [] } = useQuery(orpc.resources.list.queryOptions());

	const liveItems = data.length > 0 ? data : PLACEHOLDER_RESOURCES;
	const isLive = data.length > 0;

	const items = activeCategory === "semua"
		? liveItems
		: liveItems.filter((r) => r.category === activeCategory);

	return (
		<>
			<PageHero
				title="Materi Gratis"
				subtitle="Tips belajar, vocabulary list, template, dan panduan gratis untuk mendukung perjalanan bahasa Inggrismu."
				breadcrumbs={[{ label: "Materi Gratis" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Filter */}
				<div className="mb-6 flex gap-2 overflow-x-auto pb-1">
					{CATEGORIES.map(({ id, label }) => (
						<button
							key={id}
							type="button"
							onClick={() => setActiveCategory(id)}
							className={[
								"shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 active:scale-[0.97]",
								activeCategory === id
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
							].join(" ")}
						>
							{label}
						</button>
					))}
				</div>

				{/* Grid */}
				{items.length === 0 ? (
					<div className="py-20 text-center">
						<div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-primary/10">
							<BookOpen className="size-8 text-primary" />
						</div>
						<p className="mt-4 text-sm font-semibold text-foreground">
							Belum ada materi di kategori ini
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((resource, i) => (
							<div
								key={resource.id}
								className="flex flex-col rounded-xl border border-border bg-card overflow-hidden"
								style={{ animationDelay: `${i * 50}ms` }}
							>
								{/* Thumbnail placeholder */}
								<div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
									<FileTypeIcon type={resource.fileType} />
								</div>

								<div className="flex flex-1 flex-col p-4">
									<div className="flex items-center gap-2">
										<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
											{resource.category ?? "Lainnya"}
										</span>
										{resource.fileType && (
											<span className="text-xs font-mono text-muted-foreground uppercase">
												{resource.fileType}
											</span>
										)}
									</div>

									<h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
										{resource.title}
									</h3>
									{resource.description && (
										<p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
											{resource.description}
										</p>
									)}

									<div className="mt-4">
										{isLive ? (
											<a
												href={resource.fileUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-opacity active:scale-[0.97] hover:opacity-90"
											>
												<Download className="size-3.5" />
												Unduh Gratis
											</a>
										) : (
											<div className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
												<Download className="size-3.5" />
												Segera Tersedia
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{!isLive && (
					<p className="mt-6 text-center text-xs text-muted-foreground">
						Materi unduhan akan segera ditambahkan. Pantau terus!
					</p>
				)}

				{/* CTA */}
				<div className="mt-10">
					<WhatsAppCta
						variant="full"
						label="Mau materi lebih lengkap? Ikuti program kami"
					/>
				</div>
			</div>
		</>
	);
}
