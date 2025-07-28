-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "employment_status_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
