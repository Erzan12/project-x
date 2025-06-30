/*
  Warnings:

  - You are about to drop the column `personId` on the `User` table. All the data in the column will be lost.
  - Changed the type of `employee_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "personId",
ADD COLUMN     "person_id" INTEGER,
DROP COLUMN "employee_id",
ADD COLUMN     "employee_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
