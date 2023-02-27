/*
  Warnings:

  - A unique constraint covering the columns `[name,userEmail]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Plan_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_userEmail_key" ON "Plan"("name", "userEmail");
