import { activityLogs } from "@momkiddis/db/schema";
import { desc, and, gte, eq, lte } from "drizzle-orm";
import { z } from "zod";
import { superAdminProcedure } from "../../index";

export const adminActivityRouter = {
	list: superAdminProcedure
		.input(z.object({
			page:       z.number().int().min(1).default(1),
			perPage:    z.number().int().min(1).max(50).default(20),
			action:     z.string().optional(),
			entityType: z.string().optional(),
			days:       z.number().int().min(1).max(90).default(7),
		}))
		.handler(async ({ context, input }) => {
			const { page, perPage, action, entityType, days } = input;
			const offset = (page - 1) * perPage;
			const since = Date.now() - days * 24 * 60 * 60 * 1000;

			const conditions = [gte(activityLogs.createdAt, new Date(since))];
			if (action) conditions.push(eq(activityLogs.action, action));
			if (entityType) conditions.push(eq(activityLogs.entityType, entityType));

			const rows = await context.db
				.select()
				.from(activityLogs)
				.where(and(...conditions))
				.orderBy(desc(activityLogs.createdAt))
				.limit(perPage)
				.offset(offset);

			return { items: rows, page, perPage };
		}),
};
