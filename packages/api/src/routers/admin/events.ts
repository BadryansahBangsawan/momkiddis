import { events } from "@momkiddis/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("events");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const eventInput = z.object({
	title:       z.string().min(5).max(200),
	description: z.string().max(2000).optional(),
	date:        z.number(),
	endDate:     z.number().optional(),
	location:    z.string().max(200).optional(),
	type:        z.enum(["webinar", "workshop", "kelas-terbuka"]),
	imageUrl:    z.string().url().optional().or(z.literal("")),
	isUpcoming:  z.boolean().default(true),
	isPublished: z.boolean().default(false),
	maxSeats:    z.number().int().positive().optional(),
	waMessage:   z.string().max(500).optional(),
});

export const adminEventsRouter = {
	list: guard
		.input(z.object({ page: z.number().int().min(1).default(1), perPage: z.number().int().min(1).max(50).default(10) }))
		.handler(async ({ context, input }) => {
			const offset = (input.page - 1) * input.perPage;
			const [rows, total] = await Promise.all([
				context.db.select().from(events).orderBy(desc(events.date)).limit(input.perPage).offset(offset),
				context.db.select({ count: count() }).from(events).get(),
			]);
			return { items: rows, total: total?.count ?? 0, page: input.page, perPage: input.perPage };
		}),

	getById: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(events).where(eq(events.id, input.id)).get();
			if (!row) throw new Error("Tidak ditemukan");
			return row;
		}),

	create: guard
		.input(eventInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(events).values({ id, ...input, date: new Date(input.date), endDate: input.endDate ? new Date(input.endDate) : null, createdAt: new Date(), updatedAt: new Date() });
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "event", entityId: id, entityTitle: input.title });
			return { id };
		}),

	update: guard
		.input(eventInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const { id, ...data } = input;
			await context.db.update(events).set({ ...data, date: new Date(data.date), endDate: data.endDate ? new Date(data.endDate) : null, updatedAt: new Date() }).where(eq(events.id, id));
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(events).where(eq(events.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "event", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), field: z.enum(["isPublished", "isUpcoming"]), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			const updateData = input.field === "isPublished" ? { isPublished: input.value } : { isUpcoming: input.value };
			await context.db.update(events).set({ ...updateData, updatedAt: new Date() }).where(eq(events.id, input.id));
			return { success: true };
		}),
};
