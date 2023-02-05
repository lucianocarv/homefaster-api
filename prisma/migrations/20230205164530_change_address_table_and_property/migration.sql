/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `features_on_propertyinfos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `managers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_infos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utilities_on_propertyinfos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_address_id_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_property_id_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_city_id_fkey";

-- DropForeignKey
ALTER TABLE "features_on_propertyinfos" DROP CONSTRAINT "features_on_propertyinfos_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "features_on_propertyinfos" DROP CONSTRAINT "features_on_propertyinfos_property_info_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "property_infos" DROP CONSTRAINT "property_infos_property_id_fkey";

-- DropForeignKey
ALTER TABLE "property_infos" DROP CONSTRAINT "property_infos_type_id_fkey";

-- DropForeignKey
ALTER TABLE "utilities_on_propertyinfos" DROP CONSTRAINT "utilities_on_propertyinfos_property_info_id_fkey";

-- DropForeignKey
ALTER TABLE "utilities_on_propertyinfos" DROP CONSTRAINT "utilities_on_propertyinfos_utility_id_fkey";

-- DropIndex
DROP INDEX "cities_name_province_id_global_code_key";

-- DropIndex
DROP INDEX "communities_name_city_id_global_code_key";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "addresses";

-- DropTable
DROP TABLE "features";

-- DropTable
DROP TABLE "features_on_propertyinfos";

-- DropTable
DROP TABLE "managers";

-- DropTable
DROP TABLE "property_infos";

-- DropTable
DROP TABLE "property_types";

-- DropTable
DROP TABLE "utilities";

-- DropTable
DROP TABLE "utilities_on_propertyinfos";

-- DropEnum
DROP TYPE "ManagerType";

-- CreateTable
CREATE TABLE "p_addresses" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(255) NOT NULL,
    "global_code" VARCHAR(255) NOT NULL,
    "place_id" VARCHAR(255),
    "zip" VARCHAR(16) NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "community" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_descriptions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "thumb" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "badrooms" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "rented" BOOLEAN DEFAULT false,
    "property_area" REAL NOT NULL,
    "pets_cats" INTEGER NOT NULL,
    "pets_dogs" INTEGER NOT NULL,
    "smoking" BOOLEAN NOT NULL,
    "type_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_utilities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_utilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilities_on_descriptions" (
    "description_id" INTEGER NOT NULL,
    "utility_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

-- CreateTable
CREATE TABLE "p_features" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "FeatureType" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_on_descriptions" (
    "description_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "features_on_descriptions_pkey" PRIMARY KEY ("description_id","feature_id")
);

-- CreateTable
CREATE TABLE "p_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_managers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "img_logo" VARCHAR(255),
    "img_profile" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "p_managers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_postal_code_key" ON "p_addresses"("postal_code");

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_global_code_key" ON "p_addresses"("global_code");

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_place_id_key" ON "p_addresses"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_property_id_key" ON "p_addresses"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_addresses_id_property_id_key" ON "p_addresses"("id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_descriptions_property_id_key" ON "p_descriptions"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_descriptions_id_property_id_key" ON "p_descriptions"("id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_utilities_name_key" ON "p_utilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "utilities_on_descriptions_description_id_utility_id_key" ON "utilities_on_descriptions"("description_id", "utility_id");

-- CreateIndex
CREATE UNIQUE INDEX "p_types_name_key" ON "p_types"("name");

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "p_managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_addresses" ADD CONSTRAINT "p_addresses_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_descriptions" ADD CONSTRAINT "p_descriptions_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "p_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities_on_descriptions" ADD CONSTRAINT "utilities_on_descriptions_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "p_descriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities_on_descriptions" ADD CONSTRAINT "utilities_on_descriptions_utility_id_fkey" FOREIGN KEY ("utility_id") REFERENCES "p_utilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_on_descriptions" ADD CONSTRAINT "features_on_descriptions_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "p_descriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_on_descriptions" ADD CONSTRAINT "features_on_descriptions_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "p_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
