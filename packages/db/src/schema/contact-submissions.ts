import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";

export const contactSubmissions = sqliteTable(
	"contact_submissions",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		phone: text("phone"),
		subject: text("subject").notNull(),
		message: text("message").notNull(),
		status: text("status").notNull().default("unread"),
		adminNotes: text("admin_notes"),
		repliedBy: text("replied_by"),
		repliedAt: integer("replied_at", { mode: "timestamp_ms" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("contact_status_idx").on(table.status),
		index("contact_created_idx").on(table.createdAt),
		check(
			"contact_status_check",
			sql`${table.status} IN ('unread', 'read', 'replied', 'archived')`,
		),
	],
);
