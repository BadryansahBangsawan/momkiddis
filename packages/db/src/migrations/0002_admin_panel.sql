-- Phase 1: Add role and isActive to user table
ALTER TABLE `user` ADD `role` text NOT NULL DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE `user` ADD `is_active` integer NOT NULL DEFAULT true;--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `user` (`role`);--> statement-breakpoint

-- admin_menu_settings
CREATE TABLE `admin_menu_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_key` text NOT NULL,
	`label` text NOT NULL,
	`icon` text NOT NULL,
	`description` text,
	`is_enabled` integer NOT NULL DEFAULT true,
	`sort_order` integer NOT NULL DEFAULT 0,
	`updated_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_menu_settings_menu_key_unique` ON `admin_menu_settings` (`menu_key`);--> statement-breakpoint
CREATE INDEX `admin_menu_key_idx` ON `admin_menu_settings` (`menu_key`);--> statement-breakpoint

-- contact_submissions
CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text NOT NULL DEFAULT 'unread',
	`admin_notes` text,
	`replied_by` text,
	`replied_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `contact_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `contact_created_idx` ON `contact_submissions` (`created_at`);--> statement-breakpoint

-- activity_logs
CREATE TABLE `activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text NOT NULL,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`entity_title` text,
	`details` text,
	`ip_address` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
CREATE INDEX `activity_actor_idx` ON `activity_logs` (`actor_id`);--> statement-breakpoint
CREATE INDEX `activity_entity_idx` ON `activity_logs` (`entity_type`);--> statement-breakpoint
CREATE INDEX `activity_created_idx` ON `activity_logs` (`created_at`);--> statement-breakpoint

-- site_config
CREATE TABLE `site_config` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`label` text NOT NULL,
	`group` text NOT NULL,
	`input_type` text NOT NULL,
	`updated_by` text,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `site_config_key_unique` ON `site_config` (`key`);--> statement-breakpoint
CREATE INDEX `site_config_key_idx` ON `site_config` (`key`);
