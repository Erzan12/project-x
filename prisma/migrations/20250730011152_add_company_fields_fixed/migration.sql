/*
  Warnings:

  - You are about to drop the column `status` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SubModulePermission` table. All the data in the column will be lost.
  - Made the column `civil_status` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'TEMP',
ADD COLUMN     "is_top_20000" BOOLEAN DEFAULT true,
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "telephone_no" BIGINT NOT NULL DEFAULT 23401802,
ADD COLUMN     "tin_no" BIGINT NOT NULL DEFAULT 4726828000;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "status",
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "status",
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "division_id" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PermissionTemplate" DROP COLUMN "status",
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "city_provice" TEXT,
ADD COLUMN     "contact_no" BIGINT DEFAULT 9632306492,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergency_contact_number" TEXT,
ADD COLUMN     "emergency_contact_person" TEXT,
ADD COLUMN     "home_address" TEXT,
ADD COLUMN     "zip_code" TEXT,
ALTER COLUMN "civil_status" SET NOT NULL,
ALTER COLUMN "civil_status" SET DEFAULT 'single';

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "status",
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SubModulePermission" DROP COLUMN "status",
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
