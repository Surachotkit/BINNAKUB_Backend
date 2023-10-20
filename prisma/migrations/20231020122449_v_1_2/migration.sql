-- AlterTable
ALTER TABLE `coin_list` MODIFY `price` DECIMAL(20, 2) NULL,
    MODIFY `fee` DECIMAL(20, 2) NULL,
    MODIFY `type_coin` ENUM('Stablecoin', 'Crypto') NOT NULL DEFAULT 'Crypto',
    MODIFY `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive';
