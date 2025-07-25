-- AlterTable
ALTER TABLE "Employee"
DROP COLUMN "employment_status",
ADD COLUMN "employment_status_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "EmploymentStatus" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EmploymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentStatus_code_key" ON "EmploymentStatus"("code");

-- AddForeignKey
ALTER TABLE "Employee"
ADD CONSTRAINT "Employee_employment_status_id_fkey"
FOREIGN KEY ("employment_status_id")
REFERENCES "EmploymentStatus"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
