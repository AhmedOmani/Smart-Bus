/*
  Warnings:

  - You are about to drop the column `name` on the `buses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[busNumber]` on the table `buses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supervisorId]` on the table `buses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `busNumber` to the `buses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "buses" DROP CONSTRAINT "buses_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_parentId_fkey";

-- DropIndex
DROP INDEX "buses_name_key";

-- AlterTable
ALTER TABLE "buses" DROP COLUMN "name",
ADD COLUMN     "busNumber" TEXT NOT NULL,
ADD COLUMN     "driverLicenseNumber" TEXT,
ADD COLUMN     "driverName" TEXT,
ADD COLUMN     "driverPhone" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "capacity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "homeAddress" TEXT,
ADD COLUMN     "homeLatitude" DOUBLE PRECISION,
ADD COLUMN     "homeLongitude" DOUBLE PRECISION,
ALTER COLUMN "busId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "homeAddress" TEXT,
    "homeLatitude" DOUBLE PRECISION,
    "homeLongitude" DOUBLE PRECISION,

    CONSTRAINT "supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supervisors_userId_key" ON "supervisors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "buses_busNumber_key" ON "buses"("busNumber");

-- CreateIndex
CREATE UNIQUE INDEX "buses_supervisorId_key" ON "buses"("supervisorId");

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buses" ADD CONSTRAINT "buses_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "supervisors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
