import { User } from "@prisma/client";

export const movementPatterns = [
    {
        id: 1,
        name: "squat"
    },
    {
        id: 2,
        name: "hinge"
    },
    {
        id: 3,
        name: "bridge"
    },
    {
        id: 4,
        name: "lateral rotary"
    },
    {
        id: 5,
        name: "upper-body push"
    },
    {
        id: 6,
        name: "upper-body pull"
    },
    {
        id: 7,
        name: "single-joint"
    }
]

export const userRoles = [
    { role: "admin" },
    { role: "user" }
] 

export const admin = {
    email: process.env.CYPRESS_ADMIN_EMAIL || '',
    name: "Jill Admin",
    password: process.env.CYPRESS_ADMIN_PASSWORD || '',
    role: "admin"

}

export const user = {
    email: process.env.CYPRESS_USER_EMAIL || '',
    name: "Jane User",
    password: process.env.CYPRESS_USER_PASSWORD || '',
    role: "user"
}

export const exercises = (admin: User, user: User) => {
    return [
        {
            id: 1,
            name: "Squat",
            movementPatternId: 1,
            primaryMuscles: ["quadriceps", "gluteals", "erector spinae"],
            secondaryMuscles: ["hamstrings", "adductors"],
            global: true,
            userEmail: admin.email
        },
        {
            id: 2,
            name: "Deadlift",
            movementPatternId: 2,
            primaryMuscles: ["hamstrings", "erectors"],
            secondaryMuscles: ["gluteals"],
            global: true,
            userEmail: admin.email
        },
        {
            id: 3,
            name: "Dumbbell Goblet Squat",
            movementPatternId: 1,
            primaryMuscles: ["quadriceps", "gluteals", "erector spinae"],
            secondaryMuscles: ["hamstrings", "adductors"],
            userEmail: admin.email
        },
        {
            id: 4,
            name: "Stiff-Legged Deadlift",
            movementPatternId: 2,
            primaryMuscles: ["hamstrings", "erectors"],
            secondaryMuscles: ["gluteals"],
            userEmail: user.email
        }
    ]
}

export const plans = (admin: User, user: User) => {
    return [
        {
            id: 1,
            name: 'Admin plan 1',
            userEmail: admin.email,
        },
        {
            id: 2,
            name: 'Admin plan 2',
            userEmail: admin.email,
        },
        {
            id: 3,
            name: 'User plan 1',
            userEmail: user.email,
        },
        {
            id: 4,
            name: 'User plan 2',
            userEmail: user.email,
        }
    ]
}

export const planSets = [
        {
            id: 1,
            planId: 1,
            order: 0
        },
        {
            id: 2,
            planId: 1,
            order: 1
        },
        {
            id: 3,
            planId: 2,
            order: 0
        },
        {
            id: 4,
            planId: 2,
            order: 1
        },
        {
            id: 5,
            planId: 3,
            order: 0
        },
        {
            id: 6,
            planId: 3,
            order: 1
        },
        {
            id: 7,
            planId: 4,
            order: 0
        },
        {
            id: 8,
            planId: 4,
            order: 1
        }
    ]

export const planExercises = [
        {
            id: 1,
            planSetId: 1,
            exerciseId: 1,
            targetVolume: [
                {
                    id: 1,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        },
        {
            id: 2,
            planSetId: 2,
            exerciseId: 2,
            targetVolume: [
                {
                    id: 2,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0 
        },
        {
            id: 3,
            planSetId: 3,
            exerciseId: 2,
            targetVolume: [
                {
                    id: 3,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        },
        {
            id: 4,
            planSetId: 4,
            exerciseId: 3,
            targetVolume: [
                {
                    id: 4,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        },
        {
            id: 5,
            planSetId: 5,
            exerciseId: 1,
            targetVolume: [
                {
                    id: 5,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        },
        {
            id: 6,
            planSetId: 6,
            exerciseId: 4,
            targetVolume: [
                {
                    id: 6,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0 
        },
        {
            id: 7,
            planSetId: 7,
            exerciseId: 2,
            targetVolume: [
                {
                    id: 7,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        },
        {
            id: 8,
            planSetId: 8,
            exerciseId: 4,
            targetVolume: [
                {
                    id: 8,
                    sets: 3,
                    minReps: 3,
                    maxReps: 5,
                    rest: 3 * 60
                }
            ],
            order: 0
        }
    ]
