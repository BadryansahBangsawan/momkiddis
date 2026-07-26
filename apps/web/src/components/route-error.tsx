import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@momkiddis/ui/components/button";

interface RouteErrorProps {
	error: Error;
}

/**
 * Router-wide fallback for uncaught render/hydration errors.
 *
 * Before this existed, the router had `defaultPendingComponent` and
 * `defaultNotFoundComponent` but no `defaultErrorComponent` — so any
 * uncaught error anywhere in the tree (client-side render or hydration)
 * had nothing to catch it and the page just went blank, with the actual
 * error only visible if someone happened to have devtools open. This at
 * least shows something recoverable and puts the error on record in the
 * console instead of failing silently.
 */
export function RouteError({ error }: RouteErrorProps) {
	useEffect(() => {
		console.error("[RouteError]", error);
	}, [error]);

	return (
		<div className="flex min-h-[60svh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
			<p className="text-lg font-semibold text-foreground">
				Terjadi kesalahan saat memuat halaman.
			</p>
			<p className="max-w-md text-sm text-muted-foreground">
				Silakan coba lagi. Jika masalah berlanjut, hubungi kami via WhatsApp.
			</p>
			{error?.message && (
				<pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs text-muted-foreground">
					{error.message}
				</pre>
			)}
			<div className="flex gap-2">
				<Button
					variant="default"
					size="sm"
					className="gap-1.5"
					onClick={() => window.location.reload()}
				>
					<RefreshCw className="size-3.5" />
					Muat Ulang
				</Button>
			</div>
		</div>
	);
}
