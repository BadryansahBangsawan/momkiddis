import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";

export const resources = sqliteTable(
	"resources",
	{
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		category: text("category"), // "worksheet" | "flashcard" | "template" | "tips"
		fileUrl: text("file_url").notNull(),
		thumbnailUrl: text("thumbnail_url"),
		fileType: text("file_type"), // "pdf" | "image" | "zip"
		downloadCount: integer("download_count").notNull().default(0),
		isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("resources_category_idx").on(table.category),
		index("resources_published_idx").on(table.isPublished),
		check(
			"resources_category_check",
			sql`${table.category} IS NULL OR ${table.category} IN ('worksheet', 'flashcard', 'template', 'tips')`,
		),
		check(
			"resources_file_type_check",
			sql`${table.fileType} IS NULL OR ${table.fileType} IN ('pdf', 'image', 'zip')`,
		),
	],
);
