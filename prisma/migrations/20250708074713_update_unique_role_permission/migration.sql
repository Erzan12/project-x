/*
  Warnings:

  - A unique constraint covering the columns `[role_id,sub_module_id,module_id,action]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RolePermission_role_id_sub_module_id_module_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_sub_module_id_module_id_action_key" ON "RolePermission"("role_id", "sub_module_id", "module_id", "action");
