import { adminMenuSettings } from "@momkiddis/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { superAdminProcedure, adminProcedure } from "../../index";
import { logActivity } from "../../utils/log-activity";
import { nanoid } from "nanoid";

export const adminSettingsRouter = {
	getMenuConfig: adminProcedure.handler(async ({ context }) => {
		return context.db
			.select()
			.from(adminMenuSettings)
			.orderBy(asc(adminMenuSettings.sortOrder));
	}),

	updateMenuConfig: superAdminProcedure
		.input(
			z.array(
				z.object({
					menuKey: z.string(),
					isEnabled: z.boolean(),
					sortOrder: z.number().int(),
				}),
			),
		)
		.handler(async ({ context, input }) => {
			const ctx = context as typeof context & { session: { user: { id: string; name: string } }; role: "admin" | "superadmin" };
			for (const item of input) {
				await context.db
					.update(adminMenuSettings)
					.set({
						isEnabled: item.isEnabled,
						sortOrder: item.sortOrder,
						updatedBy: ctx.session.user.id,
					})
					.where(eq(adminMenuSettings.menuKey, item.menuKey));
			}
			await logActivity({
				db: context.db as Parameters<typeof logActivity>[0]["db"],
				actorId: ctx.session.user.id,
				actorName: ctx.session.user.name,
				actorRole: ctx.role,
				action: "menu_toggle",
				entityType: "menu_setting",
				entityTitle: "Menu config updated",
			});
			return { success: true };
		}),

	seedDefaultMenus: superAdminProcedure.handler(async ({ context }) => {
		const defaults = [
			{ menuKey: "testimonials", label: "Testimoni",   icon: "MessageSquareQuote", sortOrder: 1 },
			{ menuKey: "alumni",       label: "Alumni",       icon: "GraduationCap",      sortOrder: 2 },
			{ menuKey: "gallery",      label: "Galeri",       icon: "Image",              sortOrder: 3 },
			{ menuKey: "events",       label: "Event",        icon: "Calendar",           sortOrder: 4 },
			{ menuKey: "resources",    label: "Resources",    icon: "Download",           sortOrder: 5 },
			{ menuKey: "promos",       label: "Promo",        icon: "Tag",                sortOrder: 6 },
			{ menuKey: "contacts",     label: "Pesan Masuk",  icon: "Mail",               sortOrder: 7 },
		];
		for (const m of defaults) {
			await context.db.insert(adminMenuSettings).values({ id: nanoid(), ...m }).onConflictDoNothing();
		}
		return { success: true };
	}),
};
