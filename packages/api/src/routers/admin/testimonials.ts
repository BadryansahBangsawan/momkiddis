import { testimonials } from "@momkiddis/db/schema";
import { eq, desc, and, count, like } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("testimonials");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const testimonialInput = z.object({
	authorName:  z.string().min(2).max(100),
	authorRole:  z.string().min(2).max(100),
	authorImage: z.string().url().optional().or(z.literal("")),
	programSlug: z.string().optional(),
	content:     z.string().min(10).max(1000),
	rating:      z.number().int().min(1).max(5).default(5),
	isPublished: z.boolean().default(false),
	isFeatured:  z.boolean().default(false),
});

export const adminTestimonialsRouter = {
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
			if (programSlug) conditions.push(eq(testimonials.programSlug, programSlug));
			if (isPublished !== undefined) conditions.push(eq(testimonials.isPublished, isPublished));
			if (search) conditions.push(like(testimonials.authorName, `%${search}%`));

			const [rows, total] = await Promise.all([
				context.db.select().from(testimonials)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(testimonials.createdAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(testimonials)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);
			return { items: rows, total: total?.count ?? 0, page, perPage };
		}),

	getById: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(testimonials).where(eq(testimonials.id, input.id)).get();
			if (!row) throw new Error("Tidak ditemukan");
			return row;
		}),

	create: guard
		.input(testimonialInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(testimonials).values({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "testimonial", entityId: id, entityTitle: `Testimoni dari ${input.authorName}` });
			return { id };
		}),

	update: guard
		.input(testimonialInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const { id, ...data } = input;
			await context.db.update(testimonials).set({ ...data, updatedAt: new Date() }).where(eq(testimonials.id, id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "update", entityType: "testimonial", entityId: id, entityTitle: `Testimoni dari ${input.authorName}` });
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(testimonials).where(eq(testimonials.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "testimonial", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), field: z.enum(["isPublished", "isFeatured"]), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const updateData = input.field === "isPublished" ? { isPublished: input.value } : { isFeatured: input.value };
			await context.db.update(testimonials).set({ ...updateData, updatedAt: new Date() }).where(eq(testimonials.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: input.value ? "publish" : "unpublish", entityType: "testimonial", entityId: input.id });
			return { success: true };
		}),

	bulkAction: guard
		.input(z.object({ ids: z.array(z.string()), action: z.enum(["publish", "unpublish", "delete"]) }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			for (const id of input.ids) {
				if (input.action === "delete") {
					await context.db.delete(testimonials).where(eq(testimonials.id, id));
				} else {
					await context.db.update(testimonials).set({ isPublished: input.action === "publish", updatedAt: new Date() }).where(eq(testimonials.id, id));
				}
			}
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "bulk_delete", entityType: "testimonial", details: { count: input.ids.length, action: input.action } });
			return { success: true };
		}),
};
