-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_parentId_fkey";

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
