-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "short_name" VARCHAR(2) NOT NULL,
    "global_code" VARCHAR(255) NOT NULL,
    "formatted_address" VARCHAR(255),
    "type" VARCHAR(255),
    "img_cover" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "global_code" VARCHAR(255) NOT NULL,
    "formatted_address" VARCHAR(255),
    "type" VARCHAR(255),
    "img_cover" VARCHAR(255),
    "province_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provinces_name_key" ON "provinces"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_short_name_key" ON "provinces"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_global_code_key" ON "provinces"("global_code");

-- CreateIndex
CREATE INDEX "provinces_name_short_name_idx" ON "provinces"("name", "short_name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_global_code_key" ON "cities"("global_code");

-- CreateIndex
CREATE INDEX "cities_name_province_id_idx" ON "cities"("name", "province_id");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_province_id_global_code_key" ON "cities"("name", "province_id", "global_code");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
