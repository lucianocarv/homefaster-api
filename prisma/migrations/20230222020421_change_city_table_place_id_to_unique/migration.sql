/*
  Warnings:

  - A unique constraint covering the columns `[place_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cities_place_id_key" ON "cities"("place_id");
