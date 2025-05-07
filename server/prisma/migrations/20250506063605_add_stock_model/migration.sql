/*
  Warnings:

  - You are about to drop the column `dateRange` on the `stockadvisory` table. All the data in the column will be lost.
  - You are about to drop the column `stocks` on the `stockadvisory` table. All the data in the column will be lost.
  - Added the required column `formDate` to the `StockAdvisory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `StockAdvisory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stockadvisory` DROP COLUMN `dateRange`,
    DROP COLUMN `stocks`,
    ADD COLUMN `formDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `toDate` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `stockAdvisoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_stockAdvisoryId_fkey` FOREIGN KEY (`stockAdvisoryId`) REFERENCES `StockAdvisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
