/*
  Warnings:

  - You are about to drop the column `global_code` on the `p_addresses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "p_addresses_global_code_key";

-- AlterTable
ALTER TABLE "p_addresses" DROP COLUMN "global_code";
