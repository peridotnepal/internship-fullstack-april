/*
  Warnings:

  - You are about to drop the column `dateAD` on the `golddata` table. All the data in the column will be lost.
  - You are about to drop the column `dateBS` on the `golddata` table. All the data in the column will be lost.
  - You are about to drop the column `goldRate` on the `golddata` table. All the data in the column will be lost.
  - You are about to drop the `lasttwentydaygold` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lasttwentydaysilver` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `GoldData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oneTola` to the `GoldData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenGram` to the `GoldData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `golddata` DROP COLUMN `dateAD`,
    DROP COLUMN `dateBS`,
    DROP COLUMN `goldRate`,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `oneTola` INTEGER NOT NULL,
    ADD COLUMN `tenGram` INTEGER NOT NULL;

-- DropTable
DROP TABLE `lasttwentydaygold`;

-- DropTable
DROP TABLE `lasttwentydaysilver`;

-- CreateTable
CREATE TABLE `SilverData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `tenGram` INTEGER NOT NULL,
    `oneTola` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
