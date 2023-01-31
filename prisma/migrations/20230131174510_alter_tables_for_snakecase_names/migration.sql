/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeaturesOnPropertyInfos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeaturesOnPropertyInfos" DROP CONSTRAINT "FeaturesOnPropertyInfos_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "FeaturesOnPropertyInfos" DROP CONSTRAINT "FeaturesOnPropertyInfos_property_info_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_manager_id_fkey";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "FeaturesOnPropertyInfos";

-- DropTable
DROP TABLE "Manager";

-- CreateTable
CREATE TABLE "features" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "FeatureType" NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_on_propertyinfos" (
    "property_info_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "features_on_propertyinfos_pkey" PRIMARY KEY ("property_info_id","feature_id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" SERIAL NOT NULL,
    "type" "ManagerType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "img_logo" VARCHAR(255),
    "img_profile" VARCHAR(255),

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_on_propertyinfos" ADD CONSTRAINT "features_on_propertyinfos_property_info_id_fkey" FOREIGN KEY ("property_info_id") REFERENCES "property_infos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_on_propertyinfos" ADD CONSTRAINT "features_on_propertyinfos_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
