-- CreateTable
CREATE TABLE `GoldData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateAD` VARCHAR(191) NULL,
    `dateBS` VARCHAR(191) NULL,
    `goldRate` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
