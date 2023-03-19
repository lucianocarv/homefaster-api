/*
  Warnings:

  - The values [Manager] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `manager_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `manager_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `p_managers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('User', 'Owner', 'Admin');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_manager_id_fkey";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "manager_id",
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "manager_id";

-- DropTable
DROP TABLE "p_managers";

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
