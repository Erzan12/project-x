/*
  Warnings:

  - You are about to drop the column `department_id` on the `PermissionTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermissionTemplate" DROP CONSTRAINT "PermissionTemplate_department_id_fkey";

-- AlterTable
ALTER TABLE "PermissionTemplate" DROP COLUMN "department_id";
