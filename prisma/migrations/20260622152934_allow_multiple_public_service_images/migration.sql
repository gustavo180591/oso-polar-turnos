-- DropIndex
DROP INDEX "PublicServiceImage_slug_key";

-- AlterTable
ALTER TABLE "PublicServiceImage" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "PublicServiceImage_slug_position_idx" ON "PublicServiceImage"("slug", "position");
