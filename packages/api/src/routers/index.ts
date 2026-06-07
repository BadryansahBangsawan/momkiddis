import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { testimonialsRouter } from "./testimonials";
import { alumniRouter } from "./alumni";
import { galleryRouter } from "./gallery";
import { eventsRouter } from "./events";
import { resourcesRouter } from "./resources";
import { promosRouter } from "./promos";
import {
	adminSettingsRouter,
	adminStatsRouter,
	adminUsersRouter,
	adminSiteConfigRouter,
	adminActivityRouter,
	adminContactsRouter,
	publicContactsRouter,
	adminTestimonialsRouter,
	adminAlumniRouter,
	adminGalleryRouter,
	adminEventsRouter,
	adminResourcesRouter,
	adminPromosRouter,
} from "./admin/index";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	testimonials: testimonialsRouter,
	alumni: alumniRouter,
	gallery: galleryRouter,
	events: eventsRouter,
	resources: resourcesRouter,
	promos: promosRouter,
	contacts: publicContactsRouter,
	admin: {
		settings:     adminSettingsRouter,
		stats:        adminStatsRouter,
		users:        adminUsersRouter,
		siteConfig:   adminSiteConfigRouter,
		activity:     adminActivityRouter,
		contacts:     adminContactsRouter,
		testimonials: adminTestimonialsRouter,
		alumni:       adminAlumniRouter,
		gallery:      adminGalleryRouter,
		events:       adminEventsRouter,
		resources:    adminResourcesRouter,
		promos:       adminPromosRouter,
	},
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
