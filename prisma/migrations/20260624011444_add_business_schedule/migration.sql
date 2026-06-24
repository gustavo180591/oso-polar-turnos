-- CreateTable
CREATE TABLE "BusinessSchedule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "dayName" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "morningStart" TEXT,
    "morningEnd" TEXT,
    "afternoonStart" TEXT,
    "afternoonEnd" TEXT,
    "maxAppointments" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSchedule_dayOfWeek_key" ON "BusinessSchedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "BusinessSchedule_dayOfWeek_idx" ON "BusinessSchedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "BusinessSchedule_isEnabled_idx" ON "BusinessSchedule"("isEnabled");
