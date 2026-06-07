import { promos } from "@momkiddis/db/schema";
import { eq, desc, and, count, lte, gte } from "drizzle-orm";
import { z } from "zod";
import { createMenuGuard } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

const guard = createMenuGuard("promos");
type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const promoInput = z.object({
	title:         z.string().min(3).max(200),
	description:   z.string().max(1000).optional(),
	programSlug:   z.string().optional(),
	discountLabel: z.string().max(100).optional(),
	validFrom:     z.number().optional(),
	validUntil:    z.number().optional(),
	isActive:      z.boolean().default(true),
});

export const adminPromosRouter = {
	list: guard
		.input(z.object({
			page:        z.number().int().min(1).default(1),
			perPage:     z.number().int().min(1).max(50).default(10),
			isActive:    z.boolean().optional(),
			programSlug: z.string().optional(),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, isActive, programSlug } = input;
			const offset = (page - 1) * perPage;
			const conditions = [];
			if (isActive !== undefined) conditions.push(eq(promos.isActive, isActive));
			if (programSlug) conditions.push(eq(promos.programSlug, programSlug));

			const [rows, total] = await Promise.all([
				context.db.select().from(promos)
					.where(conditions.length ? and(...conditions) : undefined)
					.orderBy(desc(promos.createdAt))
					.limit(perPage).offset(offset),
				context.db.select({ count: count() }).from(promos)
					.where(conditions.length ? and(...conditions) : undefined).get(),
			]);

			// Annotate each promo with expiry status
			const now = Date.now();
			const items = rows.map((row) => ({
				...row,
				isExpired: row.validUntil ? row.validUntil.getTime() < now : false,
			}));

			return { items, total: total?.count ?? 0, page, perPage };
		}),

	getById: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const row = await context.db.select().from(promos).where(eq(promos.id, input.id)).get();
			if (!row) throw new Error("Tidak ditemukan");
			return row;
		}),

	create: guard
		.input(promoInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const id = nanoid();
			await context.db.insert(promos).values({
				id,
				...input,
				validFrom:  input.validFrom  ? new Date(input.validFrom)  : null,
				validUntil: input.validUntil ? new Date(input.validUntil) : null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "create", entityType: "promo", entityId: id, entityTitle: input.title });
			return { id };
		}),

	update: guard
		.input(promoInput.extend({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const { id, ...data } = input;
			await context.db.update(promos).set({
				...data,
				validFrom:  data.validFrom  ? new Date(data.validFrom)  : null,
				validUntil: data.validUntil ? new Date(data.validUntil) : null,
				updatedAt: new Date(),
			}).where(eq(promos.id, id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "update", entityType: "promo", entityId: id, entityTitle: input.title });
			return { success: true };
		}),

	delete: guard
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			await context.db.delete(promos).where(eq(promos.id, input.id));
			await logActivity({ db: context.db as Parameters<typeof logActivity>[0]["db"], actorId: ctx.session.user.id, actorName: ctx.session.user.name, actorRole: ctx.role, action: "delete", entityType: "promo", entityId: input.id });
			return { success: true };
		}),

	toggle: guard
		.input(z.object({ id: z.string(), value: z.boolean() }))
		.handler(async ({ context, input }) => {
			await context.db.update(promos).set({ isActive: input.value, updatedAt: new Date() }).where(eq(promos.id, input.id));
			return { success: true };
		}),
};
