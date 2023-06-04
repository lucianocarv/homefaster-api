/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id,property_id]` on the table `p_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "p_images_id_user_id_property_id_key" ON "p_images"("id", "user_id", "property_id");
