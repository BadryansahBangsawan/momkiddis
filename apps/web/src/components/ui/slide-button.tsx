import {
	forwardRef,
	useCallback,
	useMemo,
	useRef,
	useState,
	type JSX,
} from "react";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	type PanInfo,
} from "framer-motion";
import { Check, Loader2, MessageCircle, X } from "lucide-react";
import { cn } from "@momkiddis/ui/lib/utils";

const DRAG_CONSTRAINTS = { left: 0, right: 148 };
const DRAG_THRESHOLD = 0.88;

const BUTTON_STATES = {
	initial: { width: "13rem" },
	completed: { width: "8rem" },
};

const SPRING = { type: "spring", stiffness: 400, damping: 40, mass: 0.8 } as const;

type Status = "idle" | "loading" | "success" | "error";

const StatusIcon = ({ status }: { status: Status }) => {
	const iconMap: Record<string, JSX.Element> = useMemo(
		() => ({
			loading: <Loader2 className="animate-spin" size={20} />,
			success: <Check size={20} />,
			error: <X size={20} />,
		}),
		[],
	);

	if (!iconMap[status]) return null;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
		>
			{iconMap[status]}
		</motion.div>
	);
};

interface SlideButtonProps {
	url: string;
	label?: string;
	className?: string;
}

export const SlideButton = forwardRef<HTMLDivElement, SlideButtonProps>(
	({ url, label = "Hubungi Kami", className }, ref) => {
		const [isDragging, setIsDragging] = useState(false);
		const [completed, setCompleted] = useState(false);
		const [status, setStatus] = useState<Status>("idle");
		const dragHandleRef = useRef<HTMLDivElement | null>(null);

		const dragX = useMotionValue(0);
		const springX = useSpring(dragX, SPRING);
		const dragProgress = useTransform(springX, [0, DRAG_CONSTRAINTS.right], [0, 1]);
		const adjustedWidth = useTransform(springX, (x) => x + 10);

		const handleDragStart = useCallback(() => {
			if (completed) return;
			setIsDragging(true);
		}, [completed]);

		const completeAction = useCallback(() => {
			if (completed) return;
			setCompleted(true);
			setStatus("loading");
			setTimeout(() => {
				setStatus("success");
				window.open(url, "_blank", "noopener,noreferrer");
			}, 800);
		}, [completed, url]);

		const handleDragEnd = useCallback(() => {
			if (completed) return;
			setIsDragging(false);

			if (dragProgress.get() >= DRAG_THRESHOLD) {
				completeAction();
			} else {
				dragX.set(0);
			}
		}, [completed, dragProgress, dragX, completeAction]);

		const handleDrag = useCallback(
			(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
				if (completed) return;
				dragX.set(Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right)));
			},
			[completed, dragX],
		);

		const handleKeyDown = useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				completeAction();
			},
			[completeAction],
		);

		return (
			<motion.div
				ref={ref}
				role="button"
				tabIndex={0}
				aria-label={label}
				onKeyDown={handleKeyDown}
				animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
				transition={SPRING}
				className={cn(
					"relative flex h-11 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background/60 backdrop-blur",
					className,
				)}
			>
				{/* Growing accent fill */}
				{!completed && (
					<motion.div
						style={{ width: adjustedWidth }}
						className="absolute inset-y-0 left-0 z-0 rounded-full bg-accent/20"
					/>
				)}

				{/* Label */}
				{!completed && (
					<span className="pointer-events-none relative z-[1] select-none pl-10 text-sm font-semibold text-foreground/80">
						{label}
					</span>
				)}

				{/* Drag handle */}
				<AnimatePresence>
					{!completed && (
						<motion.div
							ref={dragHandleRef}
							drag="x"
							dragConstraints={DRAG_CONSTRAINTS}
							dragElastic={0.05}
							dragMomentum={false}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							onDrag={handleDrag}
							style={{ x: springX }}
							className="absolute left-0 z-10 flex cursor-grab items-center justify-center active:cursor-grabbing"
						>
							<div
								className={cn(
									"flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform",
									isDragging && "scale-105",
								)}
							>
								<MessageCircle className="size-4" />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Completed state */}
				<AnimatePresence>
					{completed && (
						<motion.div
							className="absolute inset-0 flex items-center justify-center rounded-full bg-accent text-accent-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<AnimatePresence mode="wait">
								<StatusIcon status={status} />
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		);
	},
);

SlideButton.displayName = "SlideButton";
