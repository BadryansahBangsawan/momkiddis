import { motion } from "framer-motion";
import type { CARA_KERJA } from "@/lib/programs-content";

interface StepsSectionProps {
	steps: typeof CARA_KERJA;
}

export default function StepsSection({ steps }: StepsSectionProps) {
	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
						Cara Mendaftar
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Empat langkah mudah untuk memulai perjalanan belajar bersama Momkiddis
					</p>
				</motion.div>

				{/* Mobile: horizontal scroll */}
				<div className="mt-8 flex gap-4 overflow-x-auto pb-3 sm:hidden">
					{steps.map(({ step, title, description }) => (
						<div
							key={step}
							className="flex w-36 flex-none flex-col items-center text-center"
						>
							<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
								<span className="text-sm font-bold text-primary">{step}</span>
							</div>
							<h3 className="mt-3 text-xs font-semibold text-foreground">{title}</h3>
							<p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
								{description}
							</p>
						</div>
					))}
				</div>

				{/* Desktop: grid */}
				<div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
					{steps.map(({ step, title, description }, i) => (
						<motion.div
							key={step}
							className="relative flex flex-col items-center text-center"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
						>
							{/* Connector line */}
							{i < steps.length - 1 && (
								<div className="absolute top-6 left-[calc(50%+1.75rem)] hidden h-px w-[calc(100%-3.5rem)] bg-border lg:block" />
							)}

							{/* Step Number */}
							<div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
								<span className="text-sm font-bold text-primary">{step}</span>
							</div>

							<h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
							<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
								{description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
