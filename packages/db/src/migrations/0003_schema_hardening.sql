DROP TABLE `blog_posts`;--> statement-breakpoint
DROP INDEX `admin_menu_key_idx`;--> statement-breakpoint
DROP INDEX `site_config_key_idx`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") SELECT "id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id") SELECT "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "user_role_check" CHECK("__new_user"."role" IN ('user', 'admin', 'superadmin'))
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "email_verified", "image", "role", "is_active", "created_at", "updated_at") SELECT "id", "name", "email", "email_verified", "image", "role", "is_active", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `user` (`role`);--> statement-breakpoint
CREATE INDEX `alumni_published_idx` ON `alumni` (`is_published`);--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` integer NOT NULL,
	`end_date` integer,
	`location` text,
	`type` text,
	`image_url` text,
	`is_upcoming` integer DEFAULT true NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`max_seats` integer,
	`wa_message` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "events_type_check" CHECK("__new_events"."type" IS NULL OR "__new_events"."type" IN ('webinar', 'workshop', 'kelas-terbuka'))
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "title", "description", "date", "end_date", "location", "type", "image_url", "is_upcoming", "is_published", "max_seats", "wa_message", "created_at", "updated_at") SELECT "id", "title", "description", "date", "end_date", "location", "type", "image_url", "is_upcoming", "is_published", "max_seats", "wa_message", "created_at", "updated_at" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
CREATE INDEX `events_upcoming_idx` ON `events` (`is_upcoming`);--> statement-breakpoint
CREATE INDEX `events_date_idx` ON `events` (`date`);--> statement-breakpoint
CREATE INDEX `events_published_idx` ON `events` (`is_published`);--> statement-breakpoint
CREATE INDEX `gallery_items_published_idx` ON `gallery_items` (`is_published`);--> statement-breakpoint
CREATE TABLE `__new_testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text NOT NULL,
	`author_image` text,
	`program_slug` text,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "testimonials_rating_check" CHECK("__new_testimonials"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
INSERT INTO `__new_testimonials`("id", "author_name", "author_role", "author_image", "program_slug", "content", "rating", "is_published", "is_featured", "created_at", "updated_at") SELECT "id", "author_name", "author_role", "author_image", "program_slug", "content", "rating", "is_published", "is_featured", "created_at", "updated_at" FROM `testimonials`;--> statement-breakpoint
DROP TABLE `testimonials`;--> statement-breakpoint
ALTER TABLE `__new_testimonials` RENAME TO `testimonials`;--> statement-breakpoint
CREATE INDEX `testimonials_program_slug_idx` ON `testimonials` (`program_slug`);--> statement-breakpoint
CREATE INDEX `testimonials_featured_idx` ON `testimonials` (`is_featured`);--> statement-breakpoint
CREATE INDEX `testimonials_published_idx` ON `testimonials` (`is_published`);--> statement-breakpoint
CREATE TABLE `__new_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text,
	`file_url` text NOT NULL,
	`thumbnail_url` text,
	`file_type` text,
	`download_count` integer DEFAULT 0 NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "resources_category_check" CHECK("__new_resources"."category" IS NULL OR "__new_resources"."category" IN ('worksheet', 'flashcard', 'template', 'tips')),
	CONSTRAINT "resources_file_type_check" CHECK("__new_resources"."file_type" IS NULL OR "__new_resources"."file_type" IN ('pdf', 'image', 'zip'))
);
--> statement-breakpoint
INSERT INTO `__new_resources`("id", "title", "description", "category", "file_url", "thumbnail_url", "file_type", "download_count", "is_published", "created_at", "updated_at") SELECT "id", "title", "description", "category", "file_url", "thumbnail_url", "file_type", "download_count", "is_published", "created_at", "updated_at" FROM `resources`;--> statement-breakpoint
DROP TABLE `resources`;--> statement-breakpoint
ALTER TABLE `__new_resources` RENAME TO `resources`;--> statement-breakpoint
CREATE INDEX `resources_category_idx` ON `resources` (`category`);--> statement-breakpoint
CREATE INDEX `resources_published_idx` ON `resources` (`is_published`);--> statement-breakpoint
CREATE TABLE `__new_contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`admin_notes` text,
	`replied_by` text,
	`replied_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "contact_status_check" CHECK("__new_contact_submissions"."status" IN ('unread', 'read', 'replied', 'archived'))
);
--> statement-breakpoint
INSERT INTO `__new_contact_submissions`("id", "name", "email", "phone", "subject", "message", "status", "admin_notes", "replied_by", "replied_at", "created_at", "updated_at") SELECT "id", "name", "email", "phone", "subject", "message", "status", "admin_notes", "replied_by", "replied_at", "created_at", "updated_at" FROM `contact_submissions`;--> statement-breakpoint
DROP TABLE `contact_submissions`;--> statement-breakpoint
ALTER TABLE `__new_contact_submissions` RENAME TO `contact_submissions`;--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `contact_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `contact_created_idx` ON `contact_submissions` (`created_at`);