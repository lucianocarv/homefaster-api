/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `p_features` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "p_features_name_key" ON "p_features"("name");
