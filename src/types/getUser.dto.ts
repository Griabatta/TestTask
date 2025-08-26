import { UserRole, UserStatus } from "../entities/User"

export class getUserByUser {
    fullName: string
    dateOfBirth: Date
    status: UserStatus
    email: string
}

export class getUserByAdmin {
    id: number
    fullName: string
    dateOfBirth: Date
    status: UserStatus
    email: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
}