-- CreateTable
CREATE TABLE "PublicServiceImage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicServiceImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicServiceImage_slug_key" ON "PublicServiceImage"("slug");

-- CreateIndex
CREATE INDEX "PublicServiceImage_slug_idx" ON "PublicServiceImage"("slug");
