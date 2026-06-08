import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { AdminLayout } from "@/components/admin/admin-layout";

export const Route = createFileRoute("/admin")({
	beforeLoad: async ({ location }) => {
		// Login page tidak perlu auth
		if (location.pathname === "/admin/login") return {};

		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({ to: "/admin/login" });
		}

		const role = (session.user as { role?: string })?.role;
		if (role !== "admin" && role !== "superadmin") {
			throw redirect({ to: "/" });
		}

		const isSuperAdmin = role === "superadmin";
		return { session, role: role as "admin" | "superadmin", isSuperAdmin };
	},

	component: AdminRoot,
});

function AdminRoot() {
	const routerState = useRouterState();
	const isLoginPage = routerState.location.pathname === "/admin/login";
	const routeContext = Route.useRouteContext() as Partial<{
		session: { user: { name: string; email: string } };
		role: "admin" | "superadmin";
		isSuperAdmin: boolean;
	}>;

	// Fetch menu config dan unread count hanya di client (browser) agar session cookie selalu tersedia.
	// Disable saat SSR (server-side render) untuk menghindari UNAUTHORIZED error karena
	// context request di server tidak membawa cookie session yang benar.
	const isBrowser = typeof window !== "undefined";
	const menuQuery = useQuery({
		...orpc.admin.settings.getMenuConfig.queryOptions(),
		enabled: isBrowser && !isLoginPage && !!routeContext.session,
	});
	const unreadQuery = useQuery({
		...orpc.admin.contacts.unreadCount.queryOptions(),
		enabled: isBrowser && !isLoginPage && !!routeContext.session,
		refetchInterval: 60_000,
	});

	const menuConfig = (menuQuery.data as Array<{ menuKey: string; label: string; icon: string; isEnabled: boolean | null; sortOrder: number | null }> | undefined) ?? [];
	const unreadContacts = ((unreadQuery.data as { count: number } | undefined)?.count) ?? 0;

	// Login page renders tanpa admin layout
	if (isLoginPage || !routeContext.session || !routeContext.role) {
		return <Outlet />;
	}

	return (
		<AdminLayout
			session={routeContext.session}
			role={routeContext.role}
			isSuperAdmin={routeContext.isSuperAdmin ?? false}
			menuConfig={menuConfig}
			unreadContacts={unreadContacts}
		>
			<Outlet />
		</AdminLayout>
	);
}
