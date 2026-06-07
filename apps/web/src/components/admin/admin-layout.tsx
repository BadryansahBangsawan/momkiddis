import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { Sheet, SheetContent, SheetTrigger } from "@momkiddis/ui/components/sheet";
import { Button } from "@momkiddis/ui/components/button";
import { Menu } from "lucide-react";
import { useState } from "react";

interface MenuConfig {
	menuKey: string;
	label: string;
	icon: string;
	isEnabled: boolean | null;
	sortOrder: number | null;
}

interface AdminLayoutProps {
	session: { user: { name: string; email: string } };
	role: "admin" | "superadmin";
	isSuperAdmin: boolean;
	menuConfig: MenuConfig[];
	unreadContacts?: number;
	children: React.ReactNode;
}

export function AdminLayout({ session, role, isSuperAdmin, menuConfig, unreadContacts, children }: AdminLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const sidebar = (
		<AdminSidebar
			isSuperAdmin={isSuperAdmin}
			menuConfig={menuConfig}
			unreadContacts={unreadContacts}
		/>
	);

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Desktop sidebar */}
			<div className="hidden lg:flex lg:shrink-0">
				{sidebar}
			</div>

			{/* Mobile sidebar */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="p-0 w-60">
					{sidebar}
				</SheetContent>
			</Sheet>

			{/* Main content */}
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				{/* Header with mobile menu trigger */}
				<div className="flex items-center gap-2">
					<div className="lg:hidden pl-2 py-2">
						<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
						</Sheet>
					</div>
					<div className="flex-1">
						<AdminHeader userName={session.user.name} role={role} />
					</div>
				</div>

				{/* Page content */}
				<main className="flex-1 overflow-y-auto p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
