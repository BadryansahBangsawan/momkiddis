import { resources } from "@momkiddis/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../index";

export const resourcesRouter = {
	list: publicProcedure
		.input(
			z.object({ category: z.string().optional() }).optional(),
		)
		.handler(async ({ context, input }) => {
			const conditions = [eq(resources.isPublished, true)];
			if (input?.category) {
				conditions.push(eq(resources.category, input.category));
			}
			return context.db
				.select()
				.from(resources)
				.where(and(...conditions))
				.limit(50);
		}),
};
