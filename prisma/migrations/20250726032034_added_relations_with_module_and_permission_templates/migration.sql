-- CreateTable
CREATE TABLE "_ModuleToPermissionTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ModuleToPermissionTemplates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ModuleToPermissionTemplates_B_index" ON "_ModuleToPermissionTemplates"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToPermissionTemplates" ADD CONSTRAINT "_ModuleToPermissionTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToPermissionTemplates" ADD CONSTRAINT "_ModuleToPermissionTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
