import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const siteConfig = sqliteTable(
	"site_config",
	{
		id: text("id").primaryKey(),
		key: text("key").notNull().unique(),
		value: text("value").notNull(),
		label: text("label").notNull(),
		group: text("group").notNull(),
		inputType: text("input_type").notNull(),
		updatedBy: text("updated_by"),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("site_config_key_idx").on(table.key)],
);
