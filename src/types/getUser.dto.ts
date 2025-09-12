import { UserRole, UserStatus } from "../entities/User"

export interface getUser {
    fullName: string
    dateOfBirth: Date
    status: UserStatus
    email: string
}

export interface getUserByAdmin extends getUser{
    id: number
    role: UserRole
    createdAt: Date
    updatedAt: Date
}