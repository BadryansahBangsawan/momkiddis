import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const galleryItems = sqliteTable(
	"gallery_items",
	{
		id: text("id").primaryKey(),
		imageUrl: text("image_url").notNull(),
		caption: text("caption").notNull(),
		event: text("event").notNull(),
		takenAt: integer("taken_at", { mode: "timestamp_ms" }).notNull(),
		isPublished: integer("is_published", { mode: "boolean" })
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
		index("gallery_items_event_idx").on(table.event),
		index("gallery_items_published_idx").on(table.isPublished),
	],
);
