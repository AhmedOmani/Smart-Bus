/*
  Warnings:

  - A unique constraint covering the columns `[licensePlate]` on the table `buses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "buses" ADD COLUMN     "licensePlate" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "buses_licensePlate_key" ON "buses"("licensePlate");
