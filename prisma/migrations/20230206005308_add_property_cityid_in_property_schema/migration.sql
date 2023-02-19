-- DropForeignKey
ALTER TABLE "p_descriptions" DROP CONSTRAINT "p_descriptions_property_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_community_id_fkey";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "city_id" INTEGER;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_descriptions" ADD CONSTRAINT "p_descriptions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
