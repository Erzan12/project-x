/*
  Warnings:

  - You are about to drop the `PermissionTemplateCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermissionTemplateCompany" DROP CONSTRAINT "PermissionTemplateCompany_company_id_fkey";

-- DropForeignKey
ALTER TABLE "PermissionTemplateCompany" DROP CONSTRAINT "PermissionTemplateCompany_permission_template_id_fkey";

-- AlterTable
ALTER TABLE "PermissionTemplate" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubModulePermission" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "PermissionTemplateCompany";

-- CreateTable
CREATE TABLE "PermissionTemplateDepartment" (
    "id" SERIAL NOT NULL,
    "permission_template_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "PermissionTemplateDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateDepartment_permission_template_id_departm_key" ON "PermissionTemplateDepartment"("permission_template_id", "department_id");

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
