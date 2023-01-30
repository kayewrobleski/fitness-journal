export type MovementPattern = 'sqaut' | 'hinge' | 'bridge' | 'upper-body push' | 'upper-body pull' | 'single joint' | 'lateral rotary';

/**
 * Describes a movement that is performed during a workout
 */
export interface Exercise {
    id: number,
    name: string
    movementPattern: MovementPattern,
    primaryMuscles: string[],
    secondaryMuscles: string[],
}

/**
 * Pairs two exercises together to create a superset where Exercise A is completed first
 * and Exercise B is completed second
 */
export interface Superset {
    exerciseIdA: number,
    exerciseIdB: number
}

/**
 * A Plan is a list of exercises that should be performed during a workout session along
 * with meta data that defines the workout plan.
 */
export interface Plan {
    id: number,
    name: string,
    createdOn: Date,
    exercises: PlanExercise[],
    supersets: Superset[]
}

/**
 * A single movement that is included in a Plan along with the number of sets,
 * rep ranges, and rest period the user is targeting. 
 */
export interface PlanExercise {
    id: number,
    exerciseId: number
    targetSets: number,
    targetMinReps: number,
    targetMaxReps: number,
    targetRest: number,
    order: number
}

/**
 * A Session describes a completed Plan and includes the actual sets, reps, and rest
 * period that was executed for each exercise.
 */
export interface Session {
    id: number,
    planId: number,
    completedOn: Date,
    exercises: SessionExercise[],
    supersets: Superset[]
}

/**
 * Relationship between an exercise completed in a Session and the planned
 * exercise in a Plan
 */
export interface SessionExercise {
    id: number,
    planExerciseId: number,
    sets: SessionExerciseSet[]
}

/**
 * Log of the actual reps, weight, and rest period used for a particular 
 * exercise in a Session.
 */
export interface SessionExerciseSet {
    reps: number,
    weight: number,
    rest: number
}