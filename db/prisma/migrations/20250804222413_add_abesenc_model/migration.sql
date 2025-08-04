/*
  Warnings:

  - The values [MORNING,AFTERNOON,BOTH] on the enum `AbsenceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `absences` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportedBy` to the `absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `absences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AbsenceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "AbsenceType_new" AS ENUM ('SICK', 'PERSONAL', 'SCHOOL_EVENT', 'OTHER');
ALTER TABLE "absences" ALTER COLUMN "type" TYPE "AbsenceType_new" USING ("type"::text::"AbsenceType_new");
ALTER TYPE "AbsenceType" RENAME TO "AbsenceType_old";
ALTER TYPE "AbsenceType_new" RENAME TO "AbsenceType";
DROP TYPE "AbsenceType_old";
COMMIT;

-- DropIndex
DROP INDEX "idx_absences_date";

-- DropIndex
DROP INDEX "idx_absences_student";

-- DropIndex
DROP INDEX "idx_absences_type";

-- AlterTable
ALTER TABLE "absences" DROP COLUMN "date",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reportedBy" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "AbsenceStatus" NOT NULL DEFAULT 'PENDING';
