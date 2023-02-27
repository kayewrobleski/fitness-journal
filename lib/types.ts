export interface PlanCreateInput {
    name: string,
    planSets?: PlanSetCreateInput[]
}
export interface PlanSetCreateInput {
    planId?: number,
    order: number,
    planExercises?: PlanExerciseCreateInput[]
}

export interface PlanExerciseCreateInput {
    planSetId?: number,
    order: number,
    exerciseId: number,
    targetVolume?: PlanVolumeCreateInput[]
}

export interface PlanVolumeCreateInput {
    planExerciseId?: number,
    sets: number,
    minReps: number, 
    maxReps: number,
    rest: number
}