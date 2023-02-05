/*
  Warnings:

  - You are about to drop the column `zip` on the `p_addresses` table. All the data in the column will be lost.
  - You are about to alter the column `postal_code` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(16)`.
  - You are about to alter the column `latitude` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `formatted_address` to the `p_addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `place_id` on table `p_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `p_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `p_addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "p_addresses" DROP COLUMN "zip",
ADD COLUMN     "formatted_address" TEXT NOT NULL,
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(16),
ALTER COLUMN "place_id" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "descriptionId" INTEGER;

-- AddForeignKey
ALTER TABLE "p_descriptions" ADD CONSTRAINT "p_descriptions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
