/*
  Warnings:

  - You are about to drop the column `action` on the `UserPermission` table. All the data in the column will be lost.
  - You are about to drop the column `subModulePermissionId` on the `UserPermission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_subModulePermissionId_fkey";

-- AlterTable
ALTER TABLE "UserPermission" DROP COLUMN "action",
DROP COLUMN "subModulePermissionId",
ADD COLUMN     "role_permission_id" INTEGER,
ADD COLUMN     "user_role_permission" TEXT NOT NULL DEFAULT 'tempo';

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "RolePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
