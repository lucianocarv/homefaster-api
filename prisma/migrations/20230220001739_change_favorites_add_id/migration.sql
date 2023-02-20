/*
  Warnings:

  - The primary key for the `u_favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,property_id]` on the table `u_favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "u_favorites" DROP CONSTRAINT "u_favorites_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "u_favorites_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "u_favorites_user_id_property_id_key" ON "u_favorites"("user_id", "property_id");
