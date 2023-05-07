/*
  Warnings:

  - You are about to drop the column `city_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `community_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provinces` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `postal_code` on table `p_addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_province_id_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_city_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_city_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_community_id_fkey";

-- AlterTable
ALTER TABLE "p_addresses" ALTER COLUMN "postal_code" SET NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "city_id",
DROP COLUMN "community_id";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "communities";

-- DropTable
DROP TABLE "provinces";
