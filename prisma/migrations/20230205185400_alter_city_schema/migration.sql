/*
  Warnings:

  - You are about to drop the column `formatted_address` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `global_code` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `cities` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cities_global_code_key";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "formatted_address",
DROP COLUMN "global_code",
DROP COLUMN "type",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "place_id" TEXT NOT NULL;
