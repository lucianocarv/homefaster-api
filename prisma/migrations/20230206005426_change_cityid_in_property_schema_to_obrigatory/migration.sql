/*
  Warnings:

  - Made the column `city_id` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_city_id_fkey";

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "city_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
