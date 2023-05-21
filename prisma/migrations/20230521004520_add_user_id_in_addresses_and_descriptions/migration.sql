/*
  Warnings:

  - Added the required column `user_id` to the `p_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `p_descriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "p_addresses" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "p_descriptions" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "p_addresses" ADD CONSTRAINT "p_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_descriptions" ADD CONSTRAINT "p_descriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
