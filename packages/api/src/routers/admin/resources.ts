import { resources } from "@momkiddis/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("resources");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const resourceInput = z.object({
	title:        z.string().min(3).max(200),
	description:  z.string().max(1000).optional(),
	category:     z.enum(["worksheet", "flashcard", "template", "tips"]).optional(),
	fileUrl:      z.string().url(),
	thumbnailUrl: z.string().url().optional().or(z.literal("")),
	fileType:     z.enum(["pdf", "image", "zip"]).optional(),
	isPublished:  z.boolean().default(false),
});

export const adminResourcesRouter = {
	list: guard
		.input(z.object({
			page:        z.number().int().min(1).default(1),
			perPage:     z.number().int().min(1).max(50).default(10),
			category:    z.string().optional(),
			isPublished: z.boolean().optional(),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, category, isPublished } = input;
			const offset = (page - 1) * perPage;
			const conditions = [];
			if (category) conditions.push(eq(resources.category, category));
			if (isPublished !== undefined) conditions.push(eq(resources.isPublished, isPublished));

			const [rows, total] = await Promise.all([
				context.db.select().from(resources)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(resources.createdAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(resources)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);
			return { items: rows, total: total?.count ?? 0, page, perPage };
		}),

	getById: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(resources).where(eq(resources.id, input.id)).get();
			if (!row) throw new Error("Tidak ditemukan");
			return row;
		}),

	create: guard
		.input(resourceInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(resources).values({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "resource", entityId: id, entityTitle: input.title });
			return { id };
		}),

	update: guard
		.input(resourceInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const { id, ...data } = input;
			await context.db.update(resources).set({ ...data, updatedAt: new Date() }).where(eq(resources.id, id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "update", entityType: "resource", entityId: id, entityTitle: input.title });
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(resources).where(eq(resources.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "resource", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			await context.db.update(resources).set({ isPublished: input.value, updatedAt: new Date() }).where(eq(resources.id, input.id));
			return { success: true };
		}),
};
