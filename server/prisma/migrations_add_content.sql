-- Add Site Settings and Content Management tables

-- Site Settings table
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" VARCHAR(255) UNIQUE NOT NULL,
  "value" TEXT,
  "type" VARCHAR(50) DEFAULT 'string',
  "description" TEXT,
  "is_public" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_site_settings_key" ON "site_settings"("key");
CREATE INDEX IF NOT EXISTS "idx_site_settings_public" ON "site_settings"("is_public");

-- Content Sections table (for homepage banners, dynamic content)
CREATE TABLE IF NOT EXISTS "content_sections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) UNIQUE NOT NULL,
  "type" VARCHAR(50) NOT NULL, -- banner, hero, features, testimonials, etc
  "title" VARCHAR(500),
  "subtitle" TEXT,
  "content" TEXT,
  "image_url" VARCHAR(500),
  "link_url" VARCHAR(500),
  "button_text" VARCHAR(100),
  "sort_order" INTEGER DEFAULT 0,
  "is_active" BOOLEAN DEFAULT true,
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_content_sections_slug" ON "content_sections"("slug");
CREATE INDEX IF NOT EXISTS "idx_content_sections_type" ON "content_sections"("type");
CREATE INDEX IF NOT EXISTS "idx_content_sections_active" ON "content_sections"("is_active");

-- Insert default site settings
INSERT INTO "site_settings" ("key", "value", "type", "description", "is_public") VALUES
('site_name', 'LE TICK', 'string', 'Website name', true),
('site_email', 'contact@letick.com', 'string', 'Contact email', true),
('site_phone', '+1-234-567-8900', 'string', 'Contact phone', true),
('currency', 'USD', 'string', 'Default currency', true),
('tax_rate', '0.10', 'number', 'Tax rate (10%)', false),
('shipping_fee', '10.00', 'number', 'Standard shipping fee', true),
('free_shipping_threshold', '100.00', 'number', 'Free shipping over this amount', true)
ON CONFLICT (key) DO NOTHING;
