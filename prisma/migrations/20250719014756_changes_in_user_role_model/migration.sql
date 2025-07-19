/*
  Warnings:

  - Made the column `department_id` on table `UserRole` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_department_id_fkey";

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "department_id" SET NOT NULL,
ALTER COLUMN "department_id" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
