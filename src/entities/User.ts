import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}


@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @IsNotEmpty()
    fullName: string;

    @Column({type: 'date'})
    @IsNotEmpty()
    dateOfBirth: Date;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Exclude()
    @Column()
    @IsNotEmpty()
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    @IsEnum(UserStatus)
    status: UserStatus;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}