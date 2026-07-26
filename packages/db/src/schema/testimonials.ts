import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";

export const testimonials = sqliteTable(
	"testimonials",
	{
		id: text("id").primaryKey(),
		authorName: text("author_name").notNull(),
		authorRole: text("author_role").notNull(),
		authorImage: text("author_image"),
		programSlug: text("program_slug"),
		content: text("content").notNull(),
		rating: integer("rating").notNull().default(5),
		isPublished: integer("is_published", { mode: "boolean" })
			.notNull()
			.default(false),
		isFeatured: integer("is_featured", { mode: "boolean" })
			.notNull()
			.default(false),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("testimonials_program_slug_idx").on(table.programSlug),
		index("testimonials_featured_idx").on(table.isFeatured),
		index("testimonials_published_idx").on(table.isPublished),
		check("testimonials_rating_check", sql`${table.rating} BETWEEN 1 AND 5`),
	],
);
