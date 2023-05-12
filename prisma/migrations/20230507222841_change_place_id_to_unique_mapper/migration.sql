/*
  Warnings:

  - A unique constraint covering the columns `[id,property_id,place_id]` on the table `p_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "p_addresses_id_property_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_id_property_id_place_id_key" ON "p_addresses"("id", "property_id", "place_id");
