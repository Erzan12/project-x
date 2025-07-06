/*
  Warnings:

  - You are about to drop the column `company_id` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- AlterTable
ALTER TABLE "PermissionTemplate" DROP COLUMN "company_id",
DROP COLUMN "permissions";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role_id",
ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "UserPermissionCompany" (
    "user_permission_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "UserPermissionCompany_pkey" PRIMARY KEY ("user_permission_id","company_id")
);

-- CreateTable
CREATE TABLE "PermissionTemplateCompany" (
    "id" SERIAL NOT NULL,
    "permission_template_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "PermissionTemplateCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionTemplateRolePermission" (
    "id" SERIAL NOT NULL,
    "permission_template_id" INTEGER NOT NULL,
    "role_permission_role_id" INTEGER NOT NULL,
    "role_permission_permission_id" INTEGER NOT NULL,

    CONSTRAINT "PermissionTemplateRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateCompany_permission_template_id_company_id_key" ON "PermissionTemplateCompany"("permission_template_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key" ON "PermissionTemplateRolePermission"("permission_template_id", "role_permission_role_id", "role_permission_permission_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionCompany" ADD CONSTRAINT "UserPermissionCompany_user_permission_id_fkey" FOREIGN KEY ("user_permission_id") REFERENCES "UserPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionCompany" ADD CONSTRAINT "UserPermissionCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplate" ADD CONSTRAINT "PermissionTemplate_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateCompany" ADD CONSTRAINT "PermissionTemplateCompany_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateCompany" ADD CONSTRAINT "PermissionTemplateCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_role_permission_role_id_r_fkey" FOREIGN KEY ("role_permission_role_id", "role_permission_permission_id") REFERENCES "RolePermission"("role_id", "permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
