-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "homeAddress" TEXT,
ADD COLUMN     "homeLatitude" DOUBLE PRECISION,
ADD COLUMN     "homeLongitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "location_logs" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "busId" TEXT NOT NULL,

    CONSTRAINT "location_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_location_logs_bus" ON "location_logs"("busId");

-- CreateIndex
CREATE INDEX "idx_location_logs_timestamp" ON "location_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "location_logs" ADD CONSTRAINT "location_logs_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
