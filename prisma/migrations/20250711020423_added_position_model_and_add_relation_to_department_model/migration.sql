-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "action" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
