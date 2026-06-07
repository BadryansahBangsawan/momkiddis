import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Label } from "@momkiddis/ui/components/label";
import { authClient } from "@/lib/auth-client";
import { Shield, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		const role = (session?.user as { role?: string } | null | undefined)?.role;
		if (session && (role === "admin" || role === "superadmin")) {
			throw redirect({ to: "/admin" });
		}
	},
	component: AdminLoginPage,
});

function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const { data, error: signInError } = await authClient.signIn.email({
				email,
				password,
			});

			if (signInError || !data) {
				setError("Email atau password salah");
				return;
			}

			const role = (data.user as { role?: string })?.role;
			if (role !== "admin" && role !== "superadmin") {
				await authClient.signOut();
				setError("Email atau password salah");
				return;
			}

			router.navigate({ to: "/admin" });
		} catch {
			setError("Email atau password salah");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
						<Shield className="text-primary h-6 w-6" />
					</div>
					<h1 className="text-xl font-semibold">Masuk Panel Admin</h1>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
							disabled={isLoading}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="current-password"
							disabled={isLoading}
						/>
					</div>

					{error && (
						<p className="text-destructive rounded-md bg-red-50 px-3 py-2 text-sm dark:bg-red-950">
							{error}
						</p>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Masuk
					</Button>
				</form>
			</div>
		</div>
	);
}
