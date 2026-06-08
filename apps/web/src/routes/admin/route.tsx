import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
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

	loader: async ({ context, location }) => {
		// Login page tidak perlu fetch menu
		if (location.pathname === "/admin/login") {
			return { menuConfig: [], unreadContacts: 0 };
		}

		const [menuConfig, unreadCount] = await Promise.allSettled([
			context.queryClient.fetchQuery(orpc.admin.settings.getMenuConfig.queryOptions()),
			context.queryClient.fetchQuery(orpc.admin.contacts.unreadCount.queryOptions()),
		]);

		return {
			menuConfig: menuConfig.status === "fulfilled" ? menuConfig.value : [],
			unreadContacts: unreadCount.status === "fulfilled" ? (unreadCount.value as { count: number }).count : 0,
		};
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
	const { menuConfig, unreadContacts } = Route.useLoaderData();

	// Login page renders tanpa admin layout
	if (isLoginPage || !routeContext.session || !routeContext.role) {
		return <Outlet />;
	}

	return (
		<AdminLayout
			session={routeContext.session}
			role={routeContext.role}
			isSuperAdmin={routeContext.isSuperAdmin ?? false}
			menuConfig={menuConfig as Array<{ menuKey: string; label: string; icon: string; isEnabled: boolean | null; sortOrder: number | null }>}
			unreadContacts={unreadContacts}
		>
			<Outlet />
		</AdminLayout>
	);
}
