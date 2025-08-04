-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('MORNING', 'AFTERNOON', 'BOTH');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('ARRIVAL', 'EXIT');

-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'LOCATION', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('MORNING', 'AFTERNOON');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "location_logs" ADD COLUMN     "tripId" TEXT;

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "fcmToken" TEXT;

-- CreateTable
CREATE TABLE "absences" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "AbsenceType" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "PermissionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "PermissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "type" "TripType" NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" "TripStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_absences_student" ON "absences"("studentId");

-- CreateIndex
CREATE INDEX "idx_absences_date" ON "absences"("date");

-- CreateIndex
CREATE INDEX "idx_absences_type" ON "absences"("type");

-- CreateIndex
CREATE INDEX "idx_permissions_student" ON "permissions"("studentId");

-- CreateIndex
CREATE INDEX "idx_permissions_date" ON "permissions"("date");

-- CreateIndex
CREATE INDEX "idx_permissions_status" ON "permissions"("status");

-- CreateIndex
CREATE INDEX "idx_permissions_type" ON "permissions"("type");

-- CreateIndex
CREATE INDEX "idx_messages_sender" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "idx_messages_receiver" ON "messages"("receiverId");

-- CreateIndex
CREATE INDEX "idx_messages_read" ON "messages"("isRead");

-- CreateIndex
CREATE INDEX "idx_messages_created" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "idx_trips_bus" ON "trips"("busId");

-- CreateIndex
CREATE INDEX "idx_trips_type" ON "trips"("type");

-- CreateIndex
CREATE INDEX "idx_trips_status" ON "trips"("status");

-- CreateIndex
CREATE INDEX "idx_trips_start_time" ON "trips"("startTime");

-- CreateIndex
CREATE INDEX "idx_location_logs_trip" ON "location_logs"("tripId");

-- AddForeignKey
ALTER TABLE "location_logs" ADD CONSTRAINT "location_logs_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absences" ADD CONSTRAINT "absences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
