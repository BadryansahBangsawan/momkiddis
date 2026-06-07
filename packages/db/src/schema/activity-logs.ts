import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const activityLogs = sqliteTable(
	"activity_logs",
	{
		id: text("id").primaryKey(),
		actorId: text("actor_id").notNull(),
		actorName: text("actor_name").notNull(),
		actorRole: text("actor_role").notNull(),
		action: text("action").notNull(),
		entityType: text("entity_type").notNull(),
		entityId: text("entity_id"),
		entityTitle: text("entity_title"),
		details: text("details"),
		ipAddress: text("ip_address"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index("activity_actor_idx").on(table.actorId),
		index("activity_entity_idx").on(table.entityType),
		index("activity_created_idx").on(table.createdAt),
	],
);
