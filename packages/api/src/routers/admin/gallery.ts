import { galleryItems } from "@momkiddis/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("gallery");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const galleryInput = z.object({
	imageUrl:    z.string().url(),
	caption:     z.string().min(2).max(200),
	event:       z.string().min(2).max(100),
	takenAt:     z.number(),
	isPublished: z.boolean().default(false),
});

export const adminGalleryRouter = {
	list: guard
		.input(z.object({
			page:        z.number().int().min(1).default(1),
			perPage:     z.number().int().min(1).max(50).default(20),
			isPublished: z.boolean().optional(),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, isPublished } = input;
			const offset = (page - 1) * perPage;
			const conditions = isPublished !== undefined ? [eq(galleryItems.isPublished, isPublished)] : [];
			const [rows, total] = await Promise.all([
				context.db.select().from(galleryItems)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(galleryItems.takenAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(galleryItems)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);
			return { items: rows, total: total?.count ?? 0, page, perPage };
		}),

	create: guard
		.input(galleryInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(galleryItems).values({ id, ...input, takenAt: new Date(input.takenAt), createdAt: new Date(), updatedAt: new Date() });
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "gallery_item", entityId: id, entityTitle: input.caption });
			return { id };
		}),

	update: guard
		.input(galleryInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const { id, ...data } = input;
			await context.db.update(galleryItems).set({ ...data, takenAt: new Date(data.takenAt), updatedAt: new Date() }).where(eq(galleryItems.id, id));
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(galleryItems).where(eq(galleryItems.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "gallery_item", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			await context.db.update(galleryItems).set({ isPublished: input.value, updatedAt: new Date() }).where(eq(galleryItems.id, input.id));
			return { success: true };
		}),

	bulkAction: guard
		.input(z.object({ ids: z.array(z.string()), action: z.enum(["publish", "unpublish", "delete"]) }))
		.handler(async ({ context, input }) => {
			for (const id of input.ids) {
				if (input.action === "delete") {
					await context.db.delete(galleryItems).where(eq(galleryItems.id, id));
				} else {
					await context.db.update(galleryItems).set({ isPublished: input.action === "publish", updatedAt: new Date() }).where(eq(galleryItems.id, id));
				}
			}
			return { success: true };
		}),
};
