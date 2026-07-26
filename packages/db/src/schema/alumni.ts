import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const alumni = sqliteTable(
	"alumni",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		photo: text("photo"),
		batchLabel: text("batch_label").notNull(),
		programSlug: text("program_slug").notNull(),
		certificateUrl: text("certificate_url"),
		shortStory: text("short_story").notNull(),
		isPublished: integer("is_published", { mode: "boolean" })
			.notNull()
			.default(false),
		isFeatured: integer("is_featured", { mode: "boolean" })
			.notNull()
			.default(false),
		graduatedAt: integer("graduated_at", { mode: "timestamp_ms" }).notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("alumni_program_slug_idx").on(table.programSlug),
		index("alumni_featured_idx").on(table.isFeatured),
		index("alumni_published_idx").on(table.isPublished),
	],
);
