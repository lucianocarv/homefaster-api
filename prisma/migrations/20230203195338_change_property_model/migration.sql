/*
  Warnings:

  - You are about to alter the column `lat` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `lng` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `utilities_on_properties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bathrooms` to the `property_infos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "utilities_on_properties" DROP CONSTRAINT "utilities_on_properties_property_info_id_fkey";

-- DropForeignKey
ALTER TABLE "utilities_on_properties" DROP CONSTRAINT "utilities_on_properties_utility_id_fkey";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "lat" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "lng" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "property_infos" ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ALTER COLUMN "rented" SET DEFAULT false;

-- DropTable
DROP TABLE "utilities_on_properties";

-- CreateTable
CREATE TABLE "utilities_on_propertyinfos" (
    "property_info_id" INTEGER NOT NULL,
    "utility_id" INTEGER NOT NULL,

    CONSTRAINT "utilities_on_propertyinfos_pkey" PRIMARY KEY ("property_info_id","utility_id")
);

-- AddForeignKey
ALTER TABLE "utilities_on_propertyinfos" ADD CONSTRAINT "utilities_on_propertyinfos_property_info_id_fkey" FOREIGN KEY ("property_info_id") REFERENCES "property_infos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities_on_propertyinfos" ADD CONSTRAINT "utilities_on_propertyinfos_utility_id_fkey" FOREIGN KEY ("utility_id") REFERENCES "utilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
