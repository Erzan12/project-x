-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_reset" TEXT DEFAULT '',
ADD COLUMN     "require_reset" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;
