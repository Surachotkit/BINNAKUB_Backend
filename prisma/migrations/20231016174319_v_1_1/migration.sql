/*
  Warnings:

  - You are about to drop the column `userId` on the `history_payment` table. All the data in the column will be lost.
  - You are about to drop the column `coinListId` on the `portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - Added the required column `user_id` to the `History_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `average_purchase_price` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coin_name` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit_or_loss` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `history_payment` DROP FOREIGN KEY `History_payment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `portfolio` DROP FOREIGN KEY `Portfolio_coinListId_fkey`;

-- DropForeignKey
ALTER TABLE `portfolio` DROP FOREIGN KEY `Portfolio_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_portfolioId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_userId_fkey`;

-- AlterTable
ALTER TABLE `history_payment` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `portfolio` DROP COLUMN `coinListId`,
    DROP COLUMN `price`,
    DROP COLUMN `userId`,
    ADD COLUMN `average_purchase_price` DECIMAL(20, 2) NOT NULL,
    ADD COLUMN `coin_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `profit_or_loss` DECIMAL(20, 5) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD COLUMN `weight` DECIMAL(20, 5) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `portfolioId`,
    DROP COLUMN `userId`,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `History_payment` ADD CONSTRAINT `History_payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Portfolio` ADD CONSTRAINT `Portfolio_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Portfolio` ADD CONSTRAINT `Portfolio_coin_name_fkey` FOREIGN KEY (`coin_name`) REFERENCES `Coin_list`(`coin_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
