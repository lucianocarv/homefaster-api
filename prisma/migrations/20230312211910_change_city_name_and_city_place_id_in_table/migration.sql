/*
  Warnings:

  - A unique constraint covering the columns `[province_id,place_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cities_name_province_id_place_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "cities_province_id_place_id_key" ON "cities"("province_id", "place_id");
