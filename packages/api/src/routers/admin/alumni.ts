import { alumni } from "@momkiddis/db/schema";
import { eq, desc, and, count, like } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("alumni");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const alumniInput = z.object({
	name:           z.string().min(2).max(100),
	photo:          z.string().url().optional().or(z.literal("")),
	batchLabel:     z.string().min(2).max(50),
	programSlug:    z.string(),
	certificateUrl: z.string().url().optional().or(z.literal("")),
	shortStory:     z.string().min(10).max(500),
	graduatedAt:    z.number(),
	isPublished:    z.boolean().default(false),
	isFeatured:     z.boolean().default(false),
});

export const adminAlumniRouter = {
	list: guard
		.input(z.object({
			page:        z.number().int().min(1).default(1),
			perPage:     z.number().int().min(1).max(50).default(10),
			programSlug: z.string().optional(),
			isPublished: z.boolean().optional(),
			search:      z.string().optional(),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, programSlug, isPublished, search } = input;
			const offset = (page - 1) * perPage;
			const conditions = [];
			if (programSlug) conditions.push(eq(alumni.programSlug, programSlug));
			if (isPublished !== undefined) conditions.push(eq(alumni.isPublished, isPublished));
			if (search) conditions.push(like(alumni.name, `%${search}%`));

			const [rows, total] = await Promise.all([
				context.db.select().from(alumni)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(alumni.graduatedAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(alumni)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);
			return { items: rows, total: total?.count ?? 0, page, perPage };
		}),

	getById: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(alumni).where(eq(alumni.id, input.id)).get();
			if (!row) throw new Error("Tidak ditemukan");
			return row;
		}),

	create: guard
		.input(alumniInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(alumni).values({ id, ...input, graduatedAt: new Date(input.graduatedAt), createdAt: new Date(), updatedAt: new Date() });
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "alumni", entityId: id, entityTitle: input.name });
			return { id };
		}),

	update: guard
		.input(alumniInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const { id, ...data } = input;
			await context.db.update(alumni).set({ ...data, graduatedAt: new Date(data.graduatedAt), updatedAt: new Date() }).where(eq(alumni.id, id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "update", entityType: "alumni", entityId: id, entityTitle: input.name });
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(alumni).where(eq(alumni.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "alumni", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), field: z.enum(["isPublished", "isFeatured"]), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			const updateData = input.field === "isPublished" ? { isPublished: input.value } : { isFeatured: input.value };
			await context.db.update(alumni).set({ ...updateData, updatedAt: new Date() }).where(eq(alumni.id, input.id));
			return { success: true };
		}),

	bulkAction: guard
		.input(z.object({ ids: z.array(z.string()), action: z.enum(["publish", "unpublish", "delete"]) }))
		.handler(async ({ context, input }) => {
			for (const id of input.ids) {
				if (input.action === "delete") {
					await context.db.delete(alumni).where(eq(alumni.id, id));
				} else {
					await context.db.update(alumni).set({ isPublished: input.action === "publish", updatedAt: new Date() }).where(eq(alumni.id, id));
				}
			}
			return { success: true };
		}),
};
