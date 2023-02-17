/*
  Warnings:

  - You are about to drop the column `supersets` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `targetMaxReps` on the `PlanExercise` table. All the data in the column will be lost.
  - You are about to drop the column `targetMinReps` on the `PlanExercise` table. All the data in the column will be lost.
  - You are about to drop the column `targetRest` on the `PlanExercise` table. All the data in the column will be lost.
  - You are about to drop the column `targetSets` on the `PlanExercise` table. All the data in the column will be lost.
  - You are about to drop the `ExercisesOnPlans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionExerciseSet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `planSetId` to the `PlanExercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExercisesOnPlans" DROP CONSTRAINT "ExercisesOnPlans_planExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "ExercisesOnPlans" DROP CONSTRAINT "ExercisesOnPlans_planId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_planId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionExercise" DROP CONSTRAINT "SessionExercise_planExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "SessionExercise" DROP CONSTRAINT "SessionExercise_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "SessionExerciseSet" DROP CONSTRAINT "SessionExerciseSet_sessionExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "SessionExerciseSet" DROP CONSTRAINT "SessionExerciseSet_unitId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "supersets";

-- AlterTable
ALTER TABLE "PlanExercise" DROP COLUMN "targetMaxReps",
DROP COLUMN "targetMinReps",
DROP COLUMN "targetRest",
DROP COLUMN "targetSets",
ADD COLUMN     "planSetId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ExercisesOnPlans";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SessionExercise";

-- DropTable
DROP TABLE "SessionExerciseSet";

-- CreateTable
CREATE TABLE "PlanSet" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "PlanSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanVolume" (
    "id" SERIAL NOT NULL,
    "planExerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "minReps" INTEGER NOT NULL,
    "maxReps" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,

    CONSTRAINT "PlanVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "completedOn" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "planSetId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" SERIAL NOT NULL,
    "workoutSetId" INTEGER NOT NULL,
    "planExerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutVolume" (
    "id" SERIAL NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,
    "workoutExerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutVolume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanSet" ADD CONSTRAINT "PlanSet_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_planSetId_fkey" FOREIGN KEY ("planSetId") REFERENCES "PlanSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanVolume" ADD CONSTRAINT "PlanVolume_planExerciseId_fkey" FOREIGN KEY ("planExerciseId") REFERENCES "PlanExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_planSetId_fkey" FOREIGN KEY ("planSetId") REFERENCES "PlanSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutSetId_fkey" FOREIGN KEY ("workoutSetId") REFERENCES "WorkoutSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_planExerciseId_fkey" FOREIGN KEY ("planExerciseId") REFERENCES "PlanExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutVolume" ADD CONSTRAINT "WorkoutVolume_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutVolume" ADD CONSTRAINT "WorkoutVolume_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
