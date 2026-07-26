import { siteConfig } from "@momkiddis/db/schema";
import { eq, inArray } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { superAdminProcedure, adminProcedure, publicProcedure } from "../../index";
import { logActivity } from "../../utils/log-activity";

type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

const siteConfigUpdateInput = z.array(
	z.object({
		key: z.string().min(1).max(100),
		value: z.string().max(2000),
	}),
).max(100);

export const publicSiteConfigRouter = {
	getAll: publicProcedure.handler(async ({ context }) => {
		const rows = await context.db.select().from(siteConfig);
		return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
	}),
};

export const adminSiteConfigRouter = {
	getAll: adminProcedure.handler(async ({ context }) => {
		const rows = await context.db.select().from(siteConfig);
		return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
	}),

	getGrouped: adminProcedure.handler(async ({ context }) => {
		return context.db.select().from(siteConfig);
	}),

	update: superAdminProcedure
		.input(siteConfigUpdateInput)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
			const keys = input.map((item) => item.key);
			const existingRows = keys.length
				? await context.db.select({ key: siteConfig.key }).from(siteConfig).where(inArray(siteConfig.key, keys))
				: [];
			const existingKeys = new Set(existingRows.map((row) => row.key));
			const unknownKeys = keys.filter((key) => !existingKeys.has(key));
			if (unknownKeys.length > 0) {
				throw new ORPCError("BAD_REQUEST", { message: `Konfigurasi tidak dikenal: ${unknownKeys.join(", ")}` });
			}

			for (const item of input) {
				await context.db
					.update(siteConfig)
					.set({ value: item.value, updatedBy: ctx.session.user.id })
					.where(eq(siteConfig.key, item.key));
			}
			await logActivity({
				db: context.db as Parameters<typeof logActivity>[0]["db"],
				actorId: ctx.session.user.id,
				actorName: ctx.session.user.name,
				actorRole: ctx.role,
				action: "config_update",
				entityType: "site_config",
				entityTitle: "Site config updated",
			});
			return { success: true };
		}),
};
