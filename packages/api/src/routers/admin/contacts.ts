import { contactSubmissions } from "@momkiddis/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, publicProcedure, createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const contactsMenuGuard = createMenuGuard("contacts");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

export const adminContactsRouter = {
	list: contactsMenuGuard
		.input(z.object({
			page:    z.number().int().min(1).default(1),
			perPage: z.number().int().min(1).max(50).default(20),
			status:  z.enum(["unread", "read", "replied", "archived"]).optional(),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, status } = input;
			const offset = (page - 1) * perPage;
			const conditions = status ? [eq(contactSubmissions.status, status)] : [];

			const [rows, total] = await Promise.all([
				context.db.select().from(contactSubmissions)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(contactSubmissions.createdAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(contactSubmissions)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);

			return { items: rows, total: total?.count ?? 0, page, perPage };
		}),

	getById: contactsMenuGuard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(contactSubmissions).where(eq(contactSubmissions.id, input.id)).get();
			if (!row) throw new Error("Pesan tidak ditemukan");
			// Auto-mark as read
			if (row.status === "unread") {
				await context.db.update(contactSubmissions).set({ status: "read" }).where(eq(contactSubmissions.id, input.id));
			}
			return row;
		}),

	updateStatus: contactsMenuGuard
		.input(z.object({
			id:     z.string(),
			status: z.enum(["read", "replied", "archived"]),
		}))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const updates: Record<string, unknown> = { status: input.status };
			if (input.status === "replied") {
				updates.repliedBy = ctx.session.user.id;
				updates.repliedAt = Date.now();
			}
			await context.db.update(contactSubmissions).set(updates).where(eq(contactSubmissions.id, input.id));
			return { success: true };
		}),

	addNote: contactsMenuGuard
		.input(z.object({ id: z.string(), note: z.string().max(1000) }))
		.handler(async ({ context, input }) => {
			await context.db.update(contactSubmissions).set({ adminNotes: input.note }).where(eq(contactSubmissions.id, input.id));
			return { success: true };
		}),

	unreadCount: adminProcedure.handler(async ({ context }) => {
		const result = await context.db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "unread")).get();
		return { count: result?.count ?? 0 };
	}),
};

// Public route for form submission
export const publicContactsRouter = {
	submit: publicProcedure
		.input(z.object({
			name:    z.string().min(2).max(100),
			email:   z.string().email(),
			phone:   z.string().max(20).optional(),
			subject: z.enum(["Tanya Program", "Pendaftaran", "Kerjasama", "Lainnya"]),
			message: z.string().min(10).max(2000),
		}))
		.handler(async ({ context, input }) => {
			await context.db.insert(contactSubmissions).values({
				id: nanoid(),
				...input,
				status: "unread",
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			return { success: true };
		}),
};
