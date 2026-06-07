import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@momkiddis/ui/components/dropdown-menu";
import { buttonVariants } from "@momkiddis/ui/components/button";
import { cn } from "@momkiddis/ui/lib/utils";
import { ChevronDown, ExternalLink, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AdminHeaderProps {
	userName: string;
	role: "admin" | "superadmin";
}

export function AdminHeader({ userName, role }: AdminHeaderProps) {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const pathname = routerState.location.pathname;

	const breadcrumbs = getBreadcrumbs(pathname);

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/admin/login" });
	};

	return (
		<header className="bg-background flex h-14 items-center justify-between border-b px-4">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-1 text-sm">
				<Link to="/admin" className="text-muted-foreground hover:text-foreground">
					Admin
				</Link>
				{breadcrumbs.map((crumb, i) => (
					<span key={crumb} className="flex items-center gap-1">
						<span className="text-muted-foreground">/</span>
						<span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
							{crumb}
						</span>
					</span>
				))}
			</nav>

			{/* User menu */}
			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(
						buttonVariants({ variant: "ghost", size: "sm" }),
						"gap-2",
					)}
				>
					<span
						className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
							role === "superadmin"
								? "bg-orange-100 text-orange-800"
								: "bg-blue-100 text-blue-800"
						}`}
					>
						{role === "superadmin" ? "Super Admin" : "Admin"}
					</span>
					<span className="max-w-[120px] truncate text-sm font-medium">{userName}</span>
					<ChevronDown className="h-3 w-3" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onSelect={() => window.open("/", "_blank")}>
						<ExternalLink className="mr-2 h-4 w-4" />
						Lihat Website
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onSelect={handleLogout}
						className="text-destructive focus:text-destructive cursor-pointer"
					>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}

function getBreadcrumbs(pathname: string): string[] {
	const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
	if (segments.length === 0) return [];

	const LABELS: Record<string, string> = {
		testimonials: "Testimoni",
		alumni: "Alumni",
		gallery: "Galeri",
		events: "Event",
		resources: "Resources",
		promos: "Promo",
		contacts: "Pesan Masuk",
		activity: "Activity Log",
		users: "User Admin",
		"site-config": "Konfigurasi",
		settings: "Pengaturan Menu",
		new: "Tambah Baru",
	};

	return segments.map((seg) => LABELS[seg] ?? seg);
}
