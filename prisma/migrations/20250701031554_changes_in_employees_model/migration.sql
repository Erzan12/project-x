/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[employee_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "position" TEXT NOT NULL,
    "salary" DECIMAL(65,30) NOT NULL,
    "pay_frequency" TEXT NOT NULL,
    "employment_status" TEXT NOT NULL,
    "monthly_equivalent_salary" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archive_date" TIMESTAMP(3),
    "other_employee_data" JSONB,
    "corporate_rank_id" INTEGER NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_person_id_key" ON "Employees"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_employee_id_key" ON "Employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_employee_id_key" ON "User"("employee_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
