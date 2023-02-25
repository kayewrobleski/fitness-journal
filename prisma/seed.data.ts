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