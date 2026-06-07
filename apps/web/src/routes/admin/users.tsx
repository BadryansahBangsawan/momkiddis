import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@momkiddis/ui/components/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@momkiddis/ui/components/alert-dialog";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Label } from "@momkiddis/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@momkiddis/ui/components/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@momkiddis/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@momkiddis/ui/components/avatar";
import { MoreHorizontal, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
	beforeLoad: ({ context }) => {
		const ctx = context as { isSuperAdmin?: boolean };
		if (!ctx.isSuperAdmin) {
			throw redirect({ to: "/admin" });
		}
	},
	component: UsersPage,
});

interface AdminUser {
	id: string;
	name: string;
	email: string;
	role: string | null;
	isActive: boolean | null;
	createdAt: Date | null;
	image: string | null;
}

function UsersPage() {
	const ctx = Route.useRouteContext() as { session?: { user: { id: string } } };
	const currentUserId = ctx.session?.user.id ?? "";

	const queryClient = useQueryClient();
	const usersQuery = useQuery(orpc.admin.users.list.queryOptions());

	const [addOpen, setAddOpen] = useState(false);
	const [roleTarget, setRoleTarget] = useState<{
		user: AdminUser;
		role: "admin" | "superadmin";
	} | null>(null);
	const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);
	const [search, setSearch] = useState("");

	const invalidate = () => {
		queryClient.invalidateQueries({
			queryKey: orpc.admin.users.list.queryOptions().queryKey,
		});
	};

	const updateRoleMutation = useMutation({
		mutationFn: (input: { userId: string; role: "admin" | "superadmin" }) =>
			client.admin.users.updateRole(input),
		onSuccess: () => {
			toast.success("Role berhasil diubah");
			setRoleTarget(null);
			invalidate();
		},
		onError: (err: Error) => toast.error(err.message ?? "Gagal mengubah role"),
	});

	const toggleActiveMutation = useMutation({
		mutationFn: (input: { userId: string; isActive: boolean }) =>
			client.admin.users.toggleActive(input),
		onSuccess: () => {
			toast.success(toggleTarget?.isActive !== false ? "Akun dinonaktifkan" : "Akun diaktifkan");
			setToggleTarget(null);
			invalidate();
		},
		onError: (err: Error) => toast.error(err.message ?? "Gagal mengubah status akun"),
	});

	const users = (usersQuery.data as AdminUser[] | undefined) ?? [];
	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()),
	);

	const columns: ColumnDef<AdminUser>[] = [
		{
			id: "user",
			header: "Pengguna",
			cell: ({ row }) => {
				const u = row.original;
				const initials = u.name
					.split(" ")
					.slice(0, 2)
					.map((w: string) => w[0])
					.join("")
					.toUpperCase();
				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-8 w-8">
							<AvatarFallback className="text-xs">{initials}</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<p className="truncate text-sm font-medium">{u.name}</p>
							<p className="text-muted-foreground truncate text-xs">{u.email}</p>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: "Role",
			size: 150,
			cell: ({ row }) => {
				const u = row.original;
				const isSelf = u.id === currentUserId;
				const isOtherSuperAdmin = u.role === "superadmin" && !isSelf;
				return (
					<Select
						value={u.role ?? "admin"}
						disabled={isOtherSuperAdmin}
						onValueChange={(newRole) => {
							setRoleTarget({ user: u, role: newRole as "admin" | "superadmin" });
						}}
					>
						<SelectTrigger className="h-7 w-[130px] text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">Admin</SelectItem>
							<SelectItem value="superadmin">Superadmin</SelectItem>
						</SelectContent>
					</Select>
				);
			},
		},
		{
			id: "status",
			header: "Status",
			size: 100,
			cell: ({ row }) => {
				const u = row.original;
				return <AdminStatusBadge status={u.isActive !== false ? "active" : "inactive"} />;
			},
		},
		{
			id: "createdAt",
			header: "Terdaftar",
			size: 120,
			cell: ({ row }) => {
				const u = row.original;
				if (!u.createdAt) return <span className="text-muted-foreground text-sm">—</span>;
				return (
					<span className="text-muted-foreground text-sm">
						{new Date(u.createdAt).toLocaleDateString("id-ID", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: "",
			size: 48,
			cell: ({ row }) => {
				const u = row.original;
				const isSelf = u.id === currentUserId;
				const isOtherSuperAdmin = u.role === "superadmin" && !isSelf;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" size="icon-sm">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								disabled={isOtherSuperAdmin}
								onSelect={() =>
									setRoleTarget({
										user: u,
										role: u.role === "superadmin" ? "admin" : "superadmin",
									})
								}
							>
								<ShieldAlert className="mr-2 h-4 w-4" />
								{u.role === "superadmin" ? "Turunkan ke Admin" : "Jadikan Superadmin"}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								disabled={isSelf || isOtherSuperAdmin}
								className={
									!isSelf && !isOtherSuperAdmin
										? "text-destructive focus:text-destructive"
										: ""
								}
								onSelect={() => !isSelf && !isOtherSuperAdmin && setToggleTarget(u)}
							>
								{u.isActive !== false ? "Nonaktifkan Akun" : "Aktifkan Akun"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<AdminDataTable
				columns={columns}
				data={filteredUsers}
				isLoading={usersQuery.isPending}
				searchPlaceholder="Cari nama atau email..."
				searchValue={search}
				onSearchChange={setSearch}
				onAdd={() => setAddOpen(true)}
				addLabel="Tambah Admin"
				emptyTitle="Belum ada admin terdaftar"
				emptyDescription="Tambahkan akun admin pertama dengan tombol di atas"
				total={filteredUsers.length}
			/>

			{/* Create admin dialog */}
			<CreateAdminDialog
				open={addOpen}
				onOpenChange={setAddOpen}
				onSuccess={() => {
					invalidate();
					setAddOpen(false);
				}}
			/>

			{/* Role change confirmation */}
			<AlertDialog open={!!roleTarget} onOpenChange={(open) => !open && setRoleTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Ubah Role?</AlertDialogTitle>
						<AlertDialogDescription>
							Role <strong>{roleTarget?.user.name}</strong> akan diubah menjadi{" "}
							<strong>
								{roleTarget?.role === "superadmin" ? "Superadmin" : "Admin"}
							</strong>
							. Aksi ini tercatat di activity log.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (!roleTarget) return;
								updateRoleMutation.mutate({
									userId: roleTarget.user.id,
									role: roleTarget.role,
								});
							}}
						>
							Ya, Ubah Role
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Toggle active confirmation */}
			<AlertDialog
				open={!!toggleTarget}
				onOpenChange={(open) => !open && setToggleTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{toggleTarget?.isActive !== false ? "Nonaktifkan" : "Aktifkan"} Akun?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Akun <strong>{toggleTarget?.name}</strong> akan{" "}
							{toggleTarget?.isActive !== false
								? "dinonaktifkan. Admin ini tidak bisa login sampai diaktifkan kembali."
								: "diaktifkan kembali dan bisa login seperti biasa."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							className={
								toggleTarget?.isActive !== false
									? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
									: ""
							}
							onClick={() => {
								if (!toggleTarget) return;
								toggleActiveMutation.mutate({
									userId: toggleTarget.id,
									isActive: toggleTarget.isActive === false,
								});
							}}
						>
							{toggleTarget?.isActive !== false ? "Nonaktifkan" : "Aktifkan"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function CreateAdminDialog({
	open,
	onOpenChange,
	onSuccess,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}) {
	const createMutation = useMutation({
		mutationFn: (input: {
			name: string;
			email: string;
			password: string;
			role: "admin" | "superadmin";
		}) => client.admin.users.create(input),
		onSuccess: () => {
			toast.success("Akun admin berhasil dibuat");
			onSuccess();
		},
		onError: (err: Error) => toast.error(err.message ?? "Gagal membuat akun"),
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "admin" as "admin" | "superadmin",
		},
		onSubmit: async ({ value }) => {
			createMutation.mutate(value);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Tambah Admin Baru
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<form.Field
						name="name"
						validators={{
							onBlur: ({ value }) => {
								if (!value || value.trim().length < 2) return "Nama minimal 2 karakter";
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="new-name">Nama</Label>
								<Input
									id="new-name"
									placeholder="Nama lengkap"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-xs">
										{field.state.meta.errors[0]?.toString()}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field
						name="email"
						validators={{
							onBlur: ({ value }) => {
								if (!value || !value.includes("@")) return "Email tidak valid";
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="new-email">Email</Label>
								<Input
									id="new-email"
									type="email"
									placeholder="admin@momkiddis.id"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-xs">
										{field.state.meta.errors[0]?.toString()}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field
						name="password"
						validators={{
							onBlur: ({ value }) => {
								if (!value || value.length < 8) return "Password minimal 8 karakter";
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="new-password">Password</Label>
								<Input
									id="new-password"
									type="password"
									placeholder="Minimal 8 karakter"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-xs">
										{field.state.meta.errors[0]?.toString()}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="role">
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="new-role">Role</Label>
								<Select
									value={field.state.value}
									onValueChange={(v) => field.handleChange(v as "admin" | "superadmin")}
								>
									<SelectTrigger id="new-role">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="superadmin">Superadmin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</form.Field>

					<DialogFooter className="mt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={createMutation.isPending}
						>
							Batal
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Membuat..." : "Buat Akun"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
