/*
  Warnings:

  - A unique constraint covering the columns `[postal_code]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[global_code]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[place_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_postal_code_key" ON "addresses"("postal_code");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_global_code_key" ON "addresses"("global_code");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_place_id_key" ON "addresses"("place_id");
