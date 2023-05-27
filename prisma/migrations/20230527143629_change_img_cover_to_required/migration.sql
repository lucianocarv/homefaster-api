/*
  Warnings:

  - Made the column `img_cover` on table `p_descriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "p_descriptions" ALTER COLUMN "img_cover" SET NOT NULL;
