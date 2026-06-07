import {
	testimonials, alumni, galleryItems, events,
	resources, promos, user, contactSubmissions, activityLogs,
} from "@momkiddis/db/schema";
import { eq, count, and, gte, desc } from "drizzle-orm";
import { adminProcedure, superAdminProcedure } from "../../index";

export const adminStatsRouter = {
	summary: adminProcedure.handler(async ({ context }) => {
		const [
			testimonialsTotal, testimonialsPublished, testimonialsFeatured,
			alumniTotal, alumniPublished, alumniFeatured,
			galleryTotal, galleryPublished,
			eventsTotal, eventsUpcoming,
			resourcesTotal, resourcesPublished,
			promosTotal, promosActive,
			usersTotal,
			contactsTotal, contactsUnread,
		] = await Promise.all([
			context.db.select({ count: count() }).from(testimonials).get(),
			context.db.select({ count: count() }).from(testimonials).where(eq(testimonials.isPublished, true)).get(),
			context.db.select({ count: count() }).from(testimonials).where(eq(testimonials.isFeatured, true)).get(),

			context.db.select({ count: count() }).from(alumni).get(),
			context.db.select({ count: count() }).from(alumni).where(eq(alumni.isPublished, true)).get(),
			context.db.select({ count: count() }).from(alumni).where(eq(alumni.isFeatured, true)).get(),

			context.db.select({ count: count() }).from(galleryItems).get(),
			context.db.select({ count: count() }).from(galleryItems).where(eq(galleryItems.isPublished, true)).get(),

			context.db.select({ count: count() }).from(events).get(),
			context.db.select({ count: count() }).from(events).where(and(eq(events.isPublished, true), eq(events.isUpcoming, true))).get(),

			context.db.select({ count: count() }).from(resources).get(),
			context.db.select({ count: count() }).from(resources).where(eq(resources.isPublished, true)).get(),

			context.db.select({ count: count() }).from(promos).get(),
			context.db.select({ count: count() }).from(promos).where(and(eq(promos.isActive, true), gte(promos.validUntil, new Date()))).get(),

			context.db.select({ count: count() }).from(user).get(),

			context.db.select({ count: count() }).from(contactSubmissions).get(),
			context.db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "unread")).get(),
		]);

		return {
			testimonials: { total: testimonialsTotal?.count ?? 0, published: testimonialsPublished?.count ?? 0, featured: testimonialsFeatured?.count ?? 0 },
			alumni:       { total: alumniTotal?.count ?? 0,       published: alumniPublished?.count ?? 0,       featured: alumniFeatured?.count ?? 0 },
			gallery:      { total: galleryTotal?.count ?? 0,      published: galleryPublished?.count ?? 0 },
			events:       { total: eventsTotal?.count ?? 0,       upcoming: eventsUpcoming?.count ?? 0 },
			resources:    { total: resourcesTotal?.count ?? 0,    published: resourcesPublished?.count ?? 0 },
			promos:       { total: promosTotal?.count ?? 0,       active: promosActive?.count ?? 0 },
			users:        { total: usersTotal?.count ?? 0 },
			contacts:     { total: contactsTotal?.count ?? 0,     unread: contactsUnread?.count ?? 0 },
		};
	}),

	recentActivity: superAdminProcedure.handler(async ({ context }) => {
		return context.db
			.select()
			.from(activityLogs)
			.orderBy(desc(activityLogs.createdAt))
			.limit(10);
	}),
};
