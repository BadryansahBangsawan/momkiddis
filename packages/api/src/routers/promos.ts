import { promos } from "@momkiddis/db/schema";
import { and, eq, isNull, lte, or, gte } from "drizzle-orm";
import { publicProcedure } from "../index";

export const promosRouter = {
	listActive: publicProcedure.handler(async ({ context }) => {
		const now = new Date();
		return context.db
			.select()
			.from(promos)
			.where(and(
				eq(promos.isActive, true),
				or(isNull(promos.validFrom), lte(promos.validFrom, now)),
				or(isNull(promos.validUntil), gte(promos.validUntil, now)),
			))
			.limit(20);
	}),
};
