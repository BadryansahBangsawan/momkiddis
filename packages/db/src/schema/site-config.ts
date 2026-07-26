import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// key is declared UNIQUE below, which SQLite auto-indexes — no separate
// index is needed on top of that (a prior redundant index was removed here).
export const siteConfig = sqliteTable("site_config", {
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
});
