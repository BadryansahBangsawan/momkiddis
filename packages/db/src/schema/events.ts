import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";

export const events = sqliteTable(
	"events",
	{
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		date: integer("date", { mode: "timestamp_ms" }).notNull(),
		endDate: integer("end_date", { mode: "timestamp_ms" }),
		location: text("location"),
		type: text("type"), // "webinar" | "workshop" | "kelas-terbuka"
		imageUrl: text("image_url"),
		isUpcoming: integer("is_upcoming", { mode: "boolean" }).notNull().default(true),
		isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
		maxSeats: integer("max_seats"),
		waMessage: text("wa_message"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("events_upcoming_idx").on(table.isUpcoming),
		index("events_date_idx").on(table.date),
		index("events_published_idx").on(table.isPublished),
		check(
			"events_type_check",
			sql`${table.type} IS NULL OR ${table.type} IN ('webinar', 'workshop', 'kelas-terbuka')`,
		),
	],
);
