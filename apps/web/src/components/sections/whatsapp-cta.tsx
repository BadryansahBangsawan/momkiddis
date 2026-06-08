import { motion } from "framer-motion";
import { Button } from "@momkiddis/ui/components/button";
import { MessageCircleIcon } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";

interface WhatsAppCtaProps {
	program?: string;
	label?: string;
	className?: string;
	size?: "default" | "lg";
	variant?: "full" | "inline";
}

export default function WhatsAppCta({
	program,
	label = "Daftar Sekarang via WhatsApp",
	className,
	size = "default",
	variant = "inline",
}: WhatsAppCtaProps) {
	const { getWaUrl } = useSiteConfig();
	const url = getWaUrl(program);

	if (variant === "full") {
		return (
			<section
				className={`bg-primary px-4 py-16 text-center sm:px-6 lg:px-8 ${className ?? ""}`}
			>
				<div className="mx-auto max-w-2xl">
					<motion.h2
						className="text-xl font-bold text-primary-foreground sm:text-2xl"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						Siap Meningkatkan Kemampuan Bahasa Inggrismu?
					</motion.h2>
					<motion.p
						className="mt-2 text-sm text-primary-foreground/80"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
					>
						Hubungi kami untuk konsultasi gratis dan informasi pendaftaran.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
					>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-6 inline-block"
						>
							<Button
								size="lg"
								className="gap-2 bg-accent text-accent-foreground transition-transform active:scale-[0.97] hover:bg-accent/90"
							>
								<MessageCircleIcon className="size-4" />
								{label}
							</Button>
						</a>
					</motion.div>
				</div>
			</section>
		);
	}

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className={className}
		>
			<Button
				size={size}
				className="gap-2 bg-accent text-accent-foreground transition-transform active:scale-[0.97] hover:bg-accent/90"
			>
				<MessageCircleIcon className="size-4" />
				{label}
			</Button>
		</a>
	);
}
