/*
  Warnings:

  - You are about to drop the column `userId` on the `Exercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userEmail]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_userId_fkey";

-- DropIndex
DROP INDEX "Exercise_name_global_userId_key";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_userEmail_key" ON "Exercise"("name", "userEmail");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
