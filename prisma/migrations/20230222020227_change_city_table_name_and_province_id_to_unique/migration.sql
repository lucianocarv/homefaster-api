/*
  Warnings:

  - A unique constraint covering the columns `[name,province_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cities_name_province_id_key" ON "cities"("name", "province_id");
