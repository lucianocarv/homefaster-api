/*
  Warnings:

  - You are about to drop the column `type` on the `communities` table. All the data in the column will be lost.
  - Made the column `formatted_address` on table `communities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "communities" DROP COLUMN "type",
ALTER COLUMN "formatted_address" SET NOT NULL;
