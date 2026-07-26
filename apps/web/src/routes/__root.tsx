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
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			context.orpc.admin.siteConfig.getAll.queryOptions(),
		);
	},

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
		scripts: [
			{
				// Polyfill for esbuild's `__name` helper (renames a function's
				// `.name` for stack traces — no other effect). TanStack Start's
				// SSR query-stream bootstrap script (the inline "$tsr" script
				// rendered at the top of <body>) ships as literal, unminified
				// source that calls `__name(...)` directly, without defining it
				// anywhere. In the browser that's a plain global reference with
				// nothing providing it, so it throws `ReferenceError: __name is
				// not defined` before hydration can run, crashing the whole
				// page to blank white right after the SSR flash. This must be
				// a plain (non-module) script in <head>, so it runs before that
				// body script and shares its global scope. Confirmed necessary
				// and sufficient via a jsdom repro of the actual production
				// page — remove if a future TanStack Start version stops
				// emitting this.
				children:
					'var __name = window.__name || function(t,v){try{Object.defineProperty(t,"name",{value:v,configurable:true})}catch(e){}return t;};',
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
