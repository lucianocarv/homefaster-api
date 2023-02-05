/*
  Warnings:

  - You are about to drop the column `formatted_address` on the `provinces` table. All the data in the column will be lost.
  - You are about to drop the column `global_code` on the `provinces` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `provinces` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "provinces_global_code_key";

-- AlterTable
ALTER TABLE "provinces" DROP COLUMN "formatted_address",
DROP COLUMN "global_code",
DROP COLUMN "type";
