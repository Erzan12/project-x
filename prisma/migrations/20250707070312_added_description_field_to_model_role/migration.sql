/*
  Warnings:

  - A unique constraint covering the columns `[role_id,permission_id,module_id]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_module_id_key" ON "RolePermission"("role_id", "permission_id", "module_id");
