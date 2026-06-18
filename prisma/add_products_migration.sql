-- =====================================================
-- PRODUCTS FEATURE MIGRATION
-- Supabase dashboard-д SQL Editor дээр ажиллуулна уу
-- =====================================================

-- 1. Product хүснэгт үүсгэх
CREATE TABLE IF NOT EXISTS "Product" (
  "id"           TEXT         NOT NULL,
  "title"        TEXT         NOT NULL,
  "description"  TEXT,
  "price"        INTEGER      NOT NULL,
  "fileKey"      TEXT         NOT NULL,
  "fileName"     TEXT         NOT NULL,
  "thumbnailUrl" TEXT,
  "isPublished"  BOOLEAN      NOT NULL DEFAULT false,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- 2. ProductPurchase хүснэгт үүсгэх
CREATE TABLE IF NOT EXISTS "ProductPurchase" (
  "id"          TEXT         NOT NULL,
  "userId"      TEXT         NOT NULL,
  "productId"   TEXT         NOT NULL,
  "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductPurchase_pkey" PRIMARY KEY ("id")
);

-- 3. ProductPurchase холбоос
ALTER TABLE "ProductPurchase"
  ADD CONSTRAINT "ProductPurchase_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductPurchase"
  ADD CONSTRAINT "ProductPurchase_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Unique index (нэг хэрэглэгч нэг бүтээгдэхүүн нэг удаа)
CREATE UNIQUE INDEX IF NOT EXISTS "ProductPurchase_userId_productId_key"
  ON "ProductPurchase"("userId", "productId");

-- 5. Payment хүснэгтийн courseId-г nullable болгох
ALTER TABLE "Payment" ALTER COLUMN "courseId" DROP NOT NULL;

-- 6. Payment хүснэгтэд productId нэмэх
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "productId" TEXT;

-- 7. productId гадаад түлхүүр
ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
