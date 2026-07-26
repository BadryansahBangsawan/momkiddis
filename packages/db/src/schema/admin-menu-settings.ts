import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// menuKey is declared UNIQUE below, which SQLite auto-indexes — no separate
// index is needed on top of that (a prior redundant index was removed here).
export const adminMenuSettings = sqliteTable("admin_menu_settings", {
	id: text("id").primaryKey(),
	menuKey: text("menu_key").notNull().unique(),
	label: text("label").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
	sortOrder: integer("sort_order").notNull().default(0),
	updatedBy: text("updated_by"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
});
