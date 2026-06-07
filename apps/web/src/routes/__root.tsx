import { Toaster } from "@momkiddis/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { orpc } from "@/utils/orpc";

import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { ChatWidget } from "../components/chat/chat-widget";

import appCss from "../index.css?url";
export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Momkiddis Indonesia — Belajar Bahasa Inggris Online",
			},
		],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
				{
					rel: "icon",
					type: "image/png",
					href: "/circle-logo.png",
				},
				{
					rel: "apple-touch-icon",
					href: "/circle-logo.png",
				},
			],
		}),

	component: RootDocument,
});

function RootDocument() {
	const routerState = useRouterState();
	const isAdmin = routerState.location.pathname.startsWith("/admin");

	if (isAdmin) {
		return (
			<html lang="id">
				<head>
					<HeadContent />
				</head>
				<body>
					<Outlet />
					<Toaster richColors />
					<Scripts />
				</body>
			</html>
		);
	}

	return (
		<html lang="id">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="flex min-h-svh flex-col">
					<SiteHeader />
					<main className="flex-1 pt-24 pb-20 md:pb-0">
						<Outlet />
					</main>
					<SiteFooter />
				</div>
				<ChatWidget />
				<Toaster richColors />
				<TanStackRouterDevtools position="bottom-left" />
				<ReactQueryDevtools
					position="bottom"
					buttonPosition="bottom-right"
				/>
				<Scripts />
			</body>
		</html>
	);
}
