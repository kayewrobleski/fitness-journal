/*
  Warnings:

  - You are about to drop the column `isCustom` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `WorkoutVolume` table. All the data in the column will be lost.
  - You are about to drop the `UserCredentials` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,global,userId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlanExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlanSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlanVolume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UnitSystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkoutSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitSystemId` to the `WorkoutVolume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkoutVolume` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCredentials" DROP CONSTRAINT "UserCredentials_email_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutVolume" DROP CONSTRAINT "WorkoutVolume_unitId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "isCustom",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deprecated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "global" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlanExercise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlanSet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlanVolume" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UnitSystem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutVolume" DROP COLUMN "unitId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "unitSystemId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "UserCredentials";

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_global_userId_key" ON "Exercise"("name", "global", "userId");

-- AddForeignKey
ALTER TABLE "WorkoutVolume" ADD CONSTRAINT "WorkoutVolume_unitSystemId_fkey" FOREIGN KEY ("unitSystemId") REFERENCES "UnitSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
