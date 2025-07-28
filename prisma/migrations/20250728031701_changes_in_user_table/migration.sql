/*
  Warnings:

  - You are about to drop the column `moduleId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_moduleId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "moduleId";

-- CreateTable
CREATE TABLE "_ModuleToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ModuleToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ModuleToUsers_B_index" ON "_ModuleToUsers"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToUsers" ADD CONSTRAINT "_ModuleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToUsers" ADD CONSTRAINT "_ModuleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
