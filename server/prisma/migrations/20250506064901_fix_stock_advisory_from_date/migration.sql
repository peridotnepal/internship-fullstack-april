/*
  Warnings:

  - You are about to drop the column `formDate` on the `stockadvisory` table. All the data in the column will be lost.
  - Added the required column `fromDate` to the `StockAdvisory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stockadvisory` DROP COLUMN `formDate`,
    ADD COLUMN `fromDate` VARCHAR(191) NOT NULL;
