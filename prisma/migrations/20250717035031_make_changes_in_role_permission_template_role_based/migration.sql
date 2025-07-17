/*
  Warnings:

  - You are about to drop the column `status` on the `PasswordResetToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "status",
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_PermissionTemplateToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PermissionTemplateToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PermissionTemplateToRole_B_index" ON "_PermissionTemplateToRole"("B");

-- AddForeignKey
ALTER TABLE "_PermissionTemplateToRole" ADD CONSTRAINT "_PermissionTemplateToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionTemplateToRole" ADD CONSTRAINT "_PermissionTemplateToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
