CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`priceAtPurchase` decimal(10,2) NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderCode` varchar(50) NOT NULL,
	`userId` int NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50) NOT NULL,
	`paymentStatus` enum('pending','confirmed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderCode_unique` UNIQUE(`orderCode`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`stock` int NOT NULL DEFAULT 999,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`discountPercentage` int NOT NULL,
	`startDate` datetime NOT NULL,
	`endDate` datetime NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`)
);
