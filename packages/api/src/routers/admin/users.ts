import { user } from "@momkiddis/db/schema";
import { eq, desc, ne } from "drizzle-orm";
import { z } from "zod";
import { superAdminProcedure } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { createAuth } from "@momkiddis/auth";

type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

export const adminUsersRouter = {
	list: superAdminProcedure.handler(async ({ context }) => {
		return context.db.select().from(user).orderBy(desc(user.createdAt));
	}),

	create: superAdminProcedure
		.input(z.object({
			name: z.string().min(2).max(100),
			email: z.string().email(),
			password: z.string().min(8),
			role: z.enum(["admin", "superadmin"]).default("admin"),
		}))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const auth = createAuth();
			// Use Better Auth to create user (handles password hashing)
			const result = await auth.api.signUpEmail({
				body: { name: input.name, email: input.email, password: input.password },
			});
			if (!result?.user?.id) {
				throw new Error("Gagal membuat akun");
			}
			// Set role
			await context.db.update(user).set({ role: input.role }).where(eq(user.id, result.user.id));
			await logActivity({
				db: context.db as Parameters<typeof logActivity>[0]["db"],
				actorId: ctx.session.user.id,
				actorName: ctx.session.user.name,
				actorRole: ctx.role,
				action: "create",
				entityType: "user",
				entityId: result.user.id,
				entityTitle: input.email,
				details: { role: input.role },
			});
			return { success: true };
		}),

	updateRole: superAdminProcedure
		.input(z.object({ userId: z.string(), role: z.enum(["admin", "superadmin"]) }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			// Superadmin cannot change another superadmin's role
			const target = await context.db.select().from(user).where(eq(user.id, input.userId)).get();
			if (!target) throw new Error("User tidak ditemukan");
			if (target.role === "superadmin" && target.id !== ctx.session.user.id) {
				throw new Error("Tidak bisa mengubah role superadmin lain");
			}
			const oldRole = target.role;
			await context.db.update(user).set({ role: input.role }).where(eq(user.id, input.userId));
			await logActivity({
				db: context.db as Parameters<typeof logActivity>[0]["db"],
				actorId: ctx.session.user.id,
				actorName: ctx.session.user.name,
				actorRole: ctx.role,
				action: "role_change",
				entityType: "user",
				entityId: input.userId,
				entityTitle: target.email,
				details: { field: "role", from: oldRole, to: input.role },
			});
			return { success: true };
		}),

	toggleActive: superAdminProcedure
		.input(z.object({ userId: z.string(), isActive: z.boolean() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			if (input.userId === ctx.session.user.id) {
				throw new Error("Tidak bisa menonaktifkan diri sendiri");
			}
			await context.db.update(user).set({ isActive: input.isActive }).where(eq(user.id, input.userId));
			return { success: true };
		}),
};
