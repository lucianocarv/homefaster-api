/*
  Warnings:

  - The values [Owner] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `name` on the `cities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(32)`.
  - You are about to alter the column `name` on the `communities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(32)`.
  - You are about to drop the column `thumb` on the `p_descriptions` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `provinces` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(32)`.
  - You are about to drop the column `avatar_url` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,city_id]` on the table `communities` will be added. If there are existing duplicate values, this will fail.
  - Made the column `rented` on table `p_descriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('User', 'Admin');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_city_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_fkey";

-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "name" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "communities" ALTER COLUMN "name" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "p_descriptions" DROP COLUMN "thumb",
ADD COLUMN     "img_cover" VARCHAR(255),
ALTER COLUMN "rented" SET NOT NULL;

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "provinces" ALTER COLUMN "name" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_url";

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_city_id_key" ON "communities"("name", "city_id");

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
