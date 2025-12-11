SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_detail`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_item`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `product_detail`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `role`;

CREATE TABLE IF NOT EXISTS `role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `uq_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `google_id` VARCHAR(50) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `role_id` INT NOT NULL,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `uq_user_email` (`email`),
  INDEX `idx_google_id` (`google_id`),
  INDEX `fk_users_role_idx` (`role_id`),
  CONSTRAINT `fk_users_roles`
    FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE INDEX `uq_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(150) NOT NULL,
  `category_id` INT NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL,
  `discount_percent` INT DEFAULT 0,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `is_hot` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`product_id`),
  INDEX `fk_product_category_idx` (`category_id`),
  CONSTRAINT `fk_product_category`
    FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_detail` (
  `product_id` INT NOT NULL,
  `origin` VARCHAR(255) DEFAULT NULL,
  `ingredients` TEXT DEFAULT NULL,
  `usage` TEXT DEFAULT NULL,
  `storage` TEXT DEFAULT NULL,
  `calories` DECIMAL(5,2) DEFAULT 0,
  `protein` DECIMAL(5,2) DEFAULT 0,
  `fat` DECIMAL(5,2) DEFAULT 0,
  `carbohydrates` DECIMAL(5,2) DEFAULT 0,
  `sugar` DECIMAL(5,2) DEFAULT 0,
  `vitamins` JSON DEFAULT NULL,
  `minerals` JSON DEFAULT NULL,
  `other_nutrients` TEXT DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  CONSTRAINT `fk_product_detail_product`
    FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE INDEX `uq_cart_user` (`user_id`),
  CONSTRAINT `fk_cart_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cart_item` (
  `cart_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT DEFAULT 1,
  `is_checked` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cart_id`, `product_id`),
  INDEX `fk_cart_item_product` (`product_id`),
  CONSTRAINT `fk_cart_item_cart`
    FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_cart_item_product_ref`
    FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `status` ENUM('pending','processing','shipping','delivered','cancelled') DEFAULT 'pending',
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `delivery_address` VARCHAR(255) NOT NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `delivery_date` DATETIME DEFAULT NULL,
  `shipping_fee` DECIMAL(12,2) DEFAULT 0,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `is_paid` TINYINT(1) DEFAULT 0,
  `payment_method` ENUM('COD','MOMO','VNPAY','BANK_TRANSFER') DEFAULT 'COD',
  `note` TEXT DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  INDEX `fk_orders_user_idx` (`user_id`),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_detail` (
  `order_detail_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL,
  `total_item_amount` DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (`order_detail_id`),
  INDEX `fk_order_detail_orders_idx` (`order_id`),
  INDEX `fk_order_detail_product_idx` (`product_id`),
  CONSTRAINT `fk_order_detail_orders`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_order_detail_product`
    FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `transaction_code` VARCHAR(100) DEFAULT NULL,
  `bank_code` VARCHAR(50) DEFAULT NULL,
  `response_code` VARCHAR(10) DEFAULT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `payment_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `note` TEXT DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  INDEX `fk_payments_orders_idx` (`order_id`),
  CONSTRAINT `fk_payments_orders`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;