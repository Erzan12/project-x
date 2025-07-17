/*
  Warnings:

  - You are about to drop the column `permission_template_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_permission_template_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission_template_id";

-- CreateTable
CREATE TABLE "_UserToPermissionTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserToPermissionTemplates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToPermissionTemplates_B_index" ON "_UserToPermissionTemplates"("B");

-- AddForeignKey
ALTER TABLE "_UserToPermissionTemplates" ADD CONSTRAINT "_UserToPermissionTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToPermissionTemplates" ADD CONSTRAINT "_UserToPermissionTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
