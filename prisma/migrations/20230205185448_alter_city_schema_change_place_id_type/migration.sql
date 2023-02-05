/*
  Warnings:

  - You are about to alter the column `place_id` on the `cities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "place_id" SET DATA TYPE VARCHAR(255);
