CREATE TABLE `food_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`price` real NOT NULL,
	`image_url` text,
	`is_available` integer DEFAULT true NOT NULL,
	`is_combo` integer DEFAULT false NOT NULL,
	`combo_items` text,
	`preparation_time` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`food_item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	`customizations` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_item_id`) REFERENCES `food_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`total_amount` real NOT NULL,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`order_status` text DEFAULT 'pending' NOT NULL,
	`pickup_code` text,
	`items` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_pickup_code_unique` ON `orders` (`pickup_code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`full_name` text NOT NULL,
	`student_id` text,
	`phone` text,
	`wallet_balance` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_student_id_unique` ON `users` (`student_id`);