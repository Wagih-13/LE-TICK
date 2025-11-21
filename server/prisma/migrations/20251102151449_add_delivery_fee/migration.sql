/*
  Warnings:

  - You are about to drop the column `country_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_city` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_state` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_zip` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the `countries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_country_id_fkey";

-- DropIndex
DROP INDEX "orders_country_id_idx";

-- DropIndex
DROP INDEX "site_settings_category_idx";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "country_id",
DROP COLUMN "shipping_city",
DROP COLUMN "shipping_state",
DROP COLUMN "shipping_zip",
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "category",
DROP COLUMN "label",
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'string';

-- DropTable
DROP TABLE "countries";

-- CreateTable
CREATE TABLE "content_sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "content" TEXT,
    "image_url" TEXT,
    "link_url" TEXT,
    "button_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_sections_slug_key" ON "content_sections"("slug");

-- CreateIndex
CREATE INDEX "content_sections_slug_idx" ON "content_sections"("slug");

-- CreateIndex
CREATE INDEX "content_sections_type_idx" ON "content_sections"("type");

-- CreateIndex
CREATE INDEX "content_sections_is_active_idx" ON "content_sections"("is_active");

-- CreateIndex
CREATE INDEX "site_settings_is_public_idx" ON "site_settings"("is_public");
