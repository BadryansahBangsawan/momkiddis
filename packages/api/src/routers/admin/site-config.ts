import { siteConfig } from "@momkiddis/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { superAdminProcedure, publicProcedure } from "../../index";
import { logActivity } from "../../utils/log-activity";

type AdminCtx = { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };

export const adminSiteConfigRouter = {
	getAll: publicProcedure.handler(async ({ context }) => {
		const rows = await context.db.select().from(siteConfig);
		return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
	}),

	getGrouped: publicProcedure.handler(async ({ context }) => {
		return context.db.select().from(siteConfig);
	}),

	update: superAdminProcedure
		.input(z.array(z.object({ key: z.string(), value: z.string() })))
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & AdminCtx;
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
