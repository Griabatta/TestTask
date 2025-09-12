import { Repository } from "typeorm";
import { User, UserRole, UserStatus } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getUser, getUserByAdmin } from "../types/getUser.dto";
import { instanceToPlain } from "class-transformer";
import { SavedUser } from "../types/createUser.types";



export class UserService {
    private userRepository: Repository<User>;

    constructor() { 
        this.userRepository = AppDataSource.getRepository(User);
    };

    async signUp(userData: Partial<User>): Promise<SavedUser> {

        const hashPass = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashPass
        });
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    };

    async logIn(email: string, password: string): Promise<{ user: Partial<User> }>  {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    };

    async getUser(userId: number, role: UserRole) {
        let user: getUser | getUserByAdmin;
        switch (role) {
            case "admin": {
                user = await this.userRepository.findOne({
                    where: {id: userId},
                    select: {
                        id          : true,
                        fullName    : true,
                        dateOfBirth : true,
                        status      : true,
                        email       : true,
                        role        : true,
                        createdAt   : true,
                        updatedAt   : true,
                    }// админу видно все, кроме пароля
                });
                break;
            }
            default: {
                user = await this.userRepository.findOne({
                    where: {id: userId},
                    select: {
                        fullName: true,
                        dateOfBirth: true,
                        status: true,
                        email: true
                    }// я посчитал, что больше пользователю получать нет необходимости(как и пароль, т.к. там хеш, да и могут быть проблемы с безопасностью)
                });
                break;
            }
        }
        if (!user) {
            throw new Error('User not found');
        };
        return user;
    };

    async getUsers() {
        const user: getUserByAdmin[] = await this.userRepository.find({
            select: {
                id          : true,
                fullName    : true,
                dateOfBirth : true,
                status      : true,
                email       : true,
                role        : true,
                createdAt   : true,
                updatedAt   : true,
            }
        });

        if (!user) {
            throw new Error('User not found');
        };
        return user;
    }

    async toggleStatus(params: {userId: number, userRole?: UserRole}) {
        const { userId, userRole } = params;
        try {
            const user = await this.userRepository.findOne({where: {id: userId}});
            

        
            if (!user) {
                throw new Error('User not found');
            };

            // if (user.status === UserStatus.BLOCKED && userRole === UserRole.USER) {                      // Вариант, если из блока может вытащить только админ
            //     throw new Error('Access denied');
            // } else if (user.status === UserStatus.BLOCKED && userRole === UserRole.ADMIN) {
            //     user.status = UserStatus.ACTIVE;
            //     await this.userRepository.save(user);
            // } else {
            //     user.status = user.status === UserStatus.ACTIVE
            //     ? UserStatus.BLOCKED
            //     : UserStatus.ACTIVE;
            // }

            user.status = user.status === UserStatus.ACTIVE                                          // Обычный вариант, пользователь сам себя может разблокировать
            ? UserStatus.BLOCKED
            : UserStatus.ACTIVE;

            await this.userRepository.save(user);
            return { fullName: user.fullName, status: user.status, email: user.email };

        } catch(e) {
            throw new Error(e.message.slice(0,100));
        };

    };


    
}