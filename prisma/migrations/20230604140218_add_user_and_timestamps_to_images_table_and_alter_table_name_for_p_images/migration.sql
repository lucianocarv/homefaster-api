/*
  Warnings:

  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_property_id_fkey";

-- DropTable
DROP TABLE "Images";

-- CreateTable
CREATE TABLE "p_images" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(100) NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "p_images_property_id_user_id_idx" ON "p_images"("property_id", "user_id");

-- AddForeignKey
ALTER TABLE "p_images" ADD CONSTRAINT "p_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_images" ADD CONSTRAINT "p_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
