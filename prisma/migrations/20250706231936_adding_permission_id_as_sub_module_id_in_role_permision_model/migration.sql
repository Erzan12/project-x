/*
  Warnings:

  - You are about to drop the column `role_permission_sub_module_id` on the `PermissionTemplateRolePermission` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `sub_module_id` on the `RolePermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[permission_template_id,role_permission_role_id,role_permission_permission_id,role_permission_module_id]` on the table `PermissionTemplateRolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_permission_module_id` to the `PermissionTemplateRolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_permission_permission_id` to the `PermissionTemplateRolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PermissionTemplateRolePermission" DROP CONSTRAINT "PermissionTemplateRolePermission_role_permission_role_id_r_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_module_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- DropIndex
DROP INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key";

-- DropIndex
DROP INDEX "RolePermission_role_id_sub_module_id_key";

-- AlterTable
ALTER TABLE "PermissionTemplateRolePermission" DROP COLUMN "role_permission_sub_module_id",
ADD COLUMN     "role_permission_module_id" INTEGER NOT NULL,
ADD COLUMN     "role_permission_permission_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "created_at",
DROP COLUMN "sub_module_id",
ADD COLUMN     "permission_id" INTEGER NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id", "permission_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key" ON "PermissionTemplateRolePermission"("permission_template_id", "role_permission_role_id", "role_permission_permission_id", "role_permission_module_id");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_role_permission_role_id_r_fkey" FOREIGN KEY ("role_permission_role_id", "role_permission_permission_id", "role_permission_module_id") REFERENCES "RolePermission"("role_id", "permission_id", "module_id") ON DELETE RESTRICT ON UPDATE CASCADE;
