/*
  Warnings:

  - You are about to drop the column `generatedAt` on the `credentials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nationalId]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nationalId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nationalId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_busId_fkey";

-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "generatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "nationalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nationalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_nationalId_key" ON "students"("nationalId");

-- CreateIndex
CREATE INDEX "idx_students_national_id" ON "students"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "users_nationalId_key" ON "users"("nationalId");

-- CreateIndex
CREATE INDEX "idx_users_national_id" ON "users"("nationalId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
