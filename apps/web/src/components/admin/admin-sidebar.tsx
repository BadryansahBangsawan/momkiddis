import { Link, useRouterState } from "@tanstack/react-router";
import {
	LayoutDashboard,
	MessageSquareQuote,
	GraduationCap,
	Image,
	Calendar,
	Download,
	Tag,
	Mail,
	Clock,
	Users,
	Settings2,
	Shield,
} from "lucide-react";
import { cn } from "@momkiddis/ui/lib/utils";
import { ScrollArea } from "@momkiddis/ui/components/scroll-area";
import { Separator } from "@momkiddis/ui/components/separator";

const ICON_MAP: Record<string, React.ElementType> = {
	LayoutDashboard,
	MessageSquareQuote,
	GraduationCap,
	Image,
	Calendar,
	Download,
	Tag,
	Mail,
	Clock,
	Users,
	Settings2,
	Shield,
};

interface MenuConfig {
	menuKey: string;
	label: string;
	icon: string;
	isEnabled: boolean | null;
	sortOrder: number | null;
}

interface AdminSidebarProps {
	isSuperAdmin: boolean;
	menuConfig: MenuConfig[];
	unreadContacts?: number;
}

const SUPERADMIN_MENUS = [
	{ key: "activity", label: "Activity Log", icon: "Clock", to: "/admin/activity" },
	{ key: "users", label: "User Admin", icon: "Users", to: "/admin/users" },
	{ key: "site-config", label: "Konfigurasi", icon: "Settings2", to: "/admin/site-config" },
	{ key: "settings", label: "Pengaturan Menu", icon: "Shield", to: "/admin/settings" },
];

export function AdminSidebar({ isSuperAdmin, menuConfig, unreadContacts = 0 }: AdminSidebarProps) {
	const routerState = useRouterState();
	const pathname = routerState.location.pathname;

	const isActive = (to: string) => {
		if (to === "/admin") return pathname === "/admin";
		return pathname.startsWith(to);
	};

	const contentMenus = menuConfig
		.filter((m) => isSuperAdmin || m.isEnabled)
		.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
		.map((m) => ({
			key: m.menuKey,
			label: m.label,
			icon: m.icon,
			to: `/admin/${m.menuKey}`,
		}));

	return (
		<div className="bg-background flex h-full w-60 flex-col border-r">
			{/* Logo */}
			<div className="flex h-14 items-center border-b px-4">
				<Link to="/admin" className="flex items-center gap-2">
					<Shield className="text-primary h-5 w-5" />
					<span className="font-semibold">Admin Panel</span>
				</Link>
			</div>

			<ScrollArea className="flex-1">
				<nav className="flex flex-col gap-1 p-3">
					{/* Dashboard — always visible */}
					<SidebarLink
						to="/admin"
						icon={LayoutDashboard}
						label="Dashboard"
						active={isActive("/admin")}
					/>

					{/* Content menus */}
					{contentMenus.length > 0 && (
						<>
							<p className="text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium uppercase tracking-wider">Konten</p>
							{contentMenus.map((menu) => {
								const Icon = ICON_MAP[menu.icon] ?? LayoutDashboard;
								const badge = menu.key === "contacts" && unreadContacts > 0 ? unreadContacts : undefined;
								return (
									<SidebarLink
										key={menu.key}
										to={menu.to as string}
										icon={Icon}
										label={menu.label}
										active={isActive(menu.to)}
										badge={badge}
									/>
								);
							})}
						</>
					)}

					{/* Superadmin-only */}
					{isSuperAdmin && (
						<>
							<Separator className="my-3" />
							<p className="text-muted-foreground mb-1 px-2 text-xs font-medium uppercase tracking-wider">Superadmin</p>
							{SUPERADMIN_MENUS.map((menu) => {
								const Icon = ICON_MAP[menu.icon] ?? LayoutDashboard;
								return (
									<SidebarLink
										key={menu.key}
										to={menu.to}
										icon={Icon}
										label={menu.label}
										active={isActive(menu.to)}
									/>
								);
							})}
						</>
					)}
				</nav>
			</ScrollArea>
		</div>
	);
}

function SidebarLink({
	to,
	icon: Icon,
	label,
	active,
	badge,
}: {
	to: string;
	icon: React.ElementType;
	label: string;
	active: boolean;
	badge?: number;
}) {
	return (
		<Link
			to={to as string}
			className={cn(
				"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
				active
					? "bg-primary text-primary-foreground"
					: "text-muted-foreground hover:bg-muted hover:text-foreground",
			)}
		>
			<Icon className="h-4 w-4 shrink-0" />
			<span className="flex-1 truncate">{label}</span>
			{badge !== undefined && (
				<span className="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs font-medium">
					{badge}
				</span>
			)}
		</Link>
	);
}
