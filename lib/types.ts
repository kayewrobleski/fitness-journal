// export interface PlanCreateInput {
//     name: string,
//     planSets?: PlanSetCreateInput[]
// }
export interface PostPlanSetInput {
    planId?: number,
    order: number,
    planExercises?: PostPlanExerciseInput[]
}

export interface PostPlanExerciseInput {
    planSetId?: string,
    order: string,
    exerciseId: string,
    targetVolume?: PostPlanVolumeInput[]
}

export interface PostPlanVolumeInput {
    planExerciseId?: string,
    sets: string,
    minReps: string, 
    maxReps: string,
    rest: string
}