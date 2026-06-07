import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const adminMenuSettings = sqliteTable(
	"admin_menu_settings",
	{
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
	},
	(table) => [index("admin_menu_key_idx").on(table.menuKey)],
);
