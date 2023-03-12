/*
  Warnings:

  - You are about to drop the column `name` on the `PlanExercise` table. All the data in the column will be lost.
  - Added the required column `order` to the `PlanSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlanExercise_name_key";

-- AlterTable
ALTER TABLE "PlanExercise" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "PlanSet" ADD COLUMN     "order" INTEGER NOT NULL;
