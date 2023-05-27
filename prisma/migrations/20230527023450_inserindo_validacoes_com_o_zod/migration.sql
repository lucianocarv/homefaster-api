/*
  Warnings:

  - You are about to alter the column `url` on the `Images` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `street` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `community` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `city` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `province` on the `p_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `name` on the `p_features` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `p_utilities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_fkey";

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "url" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "p_addresses" ALTER COLUMN "street" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "community" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "p_features" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "p_utilities" ALTER COLUMN "name" SET DATA TYPE VARCHAR(64);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
