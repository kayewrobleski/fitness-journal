-- DropForeignKey
ALTER TABLE "PlanExercise" DROP CONSTRAINT "PlanExercise_planSetId_fkey";

-- DropForeignKey
ALTER TABLE "PlanSet" DROP CONSTRAINT "PlanSet_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanVolume" DROP CONSTRAINT "PlanVolume_planExerciseId_fkey";

-- AddForeignKey
ALTER TABLE "PlanSet" ADD CONSTRAINT "PlanSet_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_planSetId_fkey" FOREIGN KEY ("planSetId") REFERENCES "PlanSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanVolume" ADD CONSTRAINT "PlanVolume_planExerciseId_fkey" FOREIGN KEY ("planExerciseId") REFERENCES "PlanExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
