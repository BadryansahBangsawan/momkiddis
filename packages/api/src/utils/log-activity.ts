import { activityLogs } from "@momkiddis/db/schema";
import { nanoid } from "nanoid";

type ActivityAction =
	| "create" | "update" | "delete" | "bulk_delete"
	| "publish" | "unpublish" | "toggle_featured"
	| "export" | "role_change" | "menu_toggle"
	| "config_update" | "status_change";

type EntityType =
	| "testimonial" | "alumni" | "gallery_item"
	| "event" | "resource" | "promo"
	| "user" | "menu_setting" | "site_config" | "contact";

interface LogActivityInput {
	db: { insert: (table: typeof activityLogs) => { values: (vals: object) => Promise<unknown> } };
	actorId: string;
	actorName: string;
	actorRole: "admin" | "superadmin";
	action: ActivityAction;
	entityType: EntityType;
	entityId?: string;
	entityTitle?: string;
	details?: Record<string, unknown>;
	ipAddress?: string;
}

export async function logActivity(input: LogActivityInput) {
	try {
		await input.db.insert(activityLogs).values({
			id: nanoid(),
			actorId: input.actorId,
			actorName: input.actorName,
			actorRole: input.actorRole,
			action: input.action,
			entityType: input.entityType,
			entityId: input.entityId ?? null,
			entityTitle: input.entityTitle ?? null,
			details: input.details ? JSON.stringify(input.details) : null,
			ipAddress: input.ipAddress ?? null,
			createdAt: Date.now(),
		});
	} catch {
		// log failure should not break the main operation
	}
}
