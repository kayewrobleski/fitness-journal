/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRole"("role") ON DELETE RESTRICT ON UPDATE CASCADE;
