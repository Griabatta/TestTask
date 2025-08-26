import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    };

    async signUp(userData: Partial<User>): Promise<User> {

        const hashPass = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashPass
        });

        return await this.userRepository.save(user);
    };

    async logIn(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        };

        return jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
    };

    
}