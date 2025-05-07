-- CreateTable
CREATE TABLE `StockAdvisory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sector` VARCHAR(191) NOT NULL,
    `stocks` VARCHAR(191) NOT NULL,
    `dateRange` VARCHAR(191) NOT NULL,
    `htmlContent` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
