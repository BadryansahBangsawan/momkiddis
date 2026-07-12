export const siteConfig = {
	name: "Momkiddis Indonesia",
	tagline: "Ibu Pintar Mengajar, Anak Cerdas Berkarya",
	description:
		"Program belajar untuk ibu, anak, remaja, profesional, serta persiapan IELTS & TOEFL.",
	founder: "Lita Hendratno",
	wa: {
		number: "6282230251104",
		defaultMessage: "Halo Momkiddis, saya ingin bertanya tentang program kelas",
	},
	social: {
		instagram: "https://instagram.com/litahendratno_",
		tiktok: "",
		youtube: "",
		facebook: "",
	},
	address: "",
	city: "",
	operationalHours: "Senin–Sabtu, 08.00–17.00 WIB",
} as const;

export function getWhatsAppUrl(program?: string) {
	const message = program
		? `Halo Momkiddis, saya ingin daftar kelas ${program}`
		: siteConfig.wa.defaultMessage;
	return `https://wa.me/${siteConfig.wa.number}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
	{ to: "/", label: "Beranda" },
	{ to: "/programs", label: "Program" },
	{ to: "/metode", label: "Metode" },
	{ to: "/alumni", label: "Alumni" },
	{ to: "/galeri", label: "Galeri" },
	{ to: "/faq", label: "FAQ" },
	{ to: "/kontak", label: "Kontak" },
] as const;
