/*
  Warnings:

  - You are about to drop the column `module_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,role_id,module_id]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_module_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "module_id",
ADD COLUMN     "moduleId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_id_module_id_key" ON "UserRole"("user_id", "role_id", "module_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;
