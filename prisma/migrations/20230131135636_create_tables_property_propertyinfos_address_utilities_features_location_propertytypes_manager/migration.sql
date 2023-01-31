-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('Property', 'Building', 'Community');

-- CreateEnum
CREATE TYPE "ManagerType" AS ENUM ('Organization', 'Private');

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_province_id_fkey";

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "community_id" INTEGER NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(255),
    "formatted_address" VARCHAR(255),
    "global_code" VARCHAR(255),
    "place_id" VARCHAR(255),
    "community_name" VARCHAR(255) NOT NULL,
    "city_name" VARCHAR(255) NOT NULL,
    "province_name" VARCHAR(255) NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_infos" (
    "id" SERIAL NOT NULL,
    "price" REAL NOT NULL,
    "badrooms" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "rented" BOOLEAN NOT NULL,
    "property_area" REAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "property_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "utilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilities_on_properties" (
    "property_info_id" INTEGER NOT NULL,
    "utility_id" INTEGER NOT NULL,

    CONSTRAINT "utilities_on_properties_pkey" PRIMARY KEY ("property_info_id","utility_id")
);

-- CreateTable
CREATE TABLE "property_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "property_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "FeatureType" NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturesOnPropertyInfos" (
    "property_info_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "FeaturesOnPropertyInfos_pkey" PRIMARY KEY ("property_info_id","feature_id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "type" "ManagerType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "img_logo" VARCHAR(255),
    "img_profile" VARCHAR(255),

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_id_community_id_key" ON "properties"("id", "community_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_property_id_key" ON "addresses"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_id_property_id_key" ON "addresses"("id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_address_id_key" ON "Location"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_infos_property_id_key" ON "property_infos"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_infos_id_property_id_key" ON "property_infos"("id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "utilities_name_key" ON "utilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "property_types_name_key" ON "property_types"("name");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_infos" ADD CONSTRAINT "property_infos_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "property_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_infos" ADD CONSTRAINT "property_infos_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities_on_properties" ADD CONSTRAINT "utilities_on_properties_property_info_id_fkey" FOREIGN KEY ("property_info_id") REFERENCES "property_infos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities_on_properties" ADD CONSTRAINT "utilities_on_properties_utility_id_fkey" FOREIGN KEY ("utility_id") REFERENCES "utilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturesOnPropertyInfos" ADD CONSTRAINT "FeaturesOnPropertyInfos_property_info_id_fkey" FOREIGN KEY ("property_info_id") REFERENCES "property_infos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturesOnPropertyInfos" ADD CONSTRAINT "FeaturesOnPropertyInfos_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
