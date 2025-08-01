-- DropForeignKey
ALTER TABLE "buses" DROP CONSTRAINT "buses_supervisorId_fkey";

-- AddForeignKey
ALTER TABLE "buses" ADD CONSTRAINT "buses_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "supervisors"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
