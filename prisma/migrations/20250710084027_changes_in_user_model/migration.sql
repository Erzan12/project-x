-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permission_template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
