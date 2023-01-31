-- CreateTable
CREATE TABLE "communities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "global_code" VARCHAR(255) NOT NULL,
    "formatted_address" VARCHAR(255),
    "type" VARCHAR(255),
    "img_cover" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "communities_global_code_key" ON "communities"("global_code");

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_city_id_global_code_key" ON "communities"("name", "city_id", "global_code");

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
