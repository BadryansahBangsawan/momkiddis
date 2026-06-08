import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { siteConfig as staticConfig } from "@/lib/site-config";

export function useSiteConfig() {
	const { data } = useQuery({
		...orpc.admin.siteConfig.getAll.queryOptions(),
		staleTime: 5 * 60 * 1000,
	});

	const waNumber = data?.whatsapp_number || staticConfig.wa.number;
	const siteName = data?.site_name || staticConfig.name;
	const instagram = data?.instagram_url || staticConfig.social.instagram;

	function getWaUrl(program?: string) {
		const message = program
			? `Halo Momkiddis, saya ingin daftar kelas ${program}`
			: staticConfig.wa.defaultMessage;
		return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
	}

	return { siteName, waNumber, instagram, getWaUrl, raw: data };
}
