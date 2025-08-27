import { CreateUserDto } from "../dtos/createUser.dto";
import { UserRole } from "../entities/User";
import { UserService } from "../services/User.service";
import { NextFunction, Request, Response } from "express";


export class UserController {
    private UserService: UserService;

    constructor() {
        this.UserService = new UserService();
    };

    signUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: CreateUserDto = req.body;
            const user = await this.UserService.signUp(userData);
            res.status(201).json(user);
            return;
        } catch(e) {
            res.status(400).json({ error: e.message});
            return;
        };
    };

    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.UserService.logIn(email, password);
            (req as any).user = result.user;
            next();
        } catch(e) {
            res.status(401).json({ error: e.message });
            return;
        };
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        res.clearCookie('auth_token');
        res.json({ message: 'Logged out successfully' });
    }

    getUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const requestedUserId = Number((req as any).params.id);
            const currentUser = (req as any).user!;

            if (currentUser.role != UserRole.ADMIN && currentUser.userId !== requestedUserId) {
                res.status(403).json({ error: 'Access denied' });
                return;
            };

            const user = await this.UserService.getUser(requestedUserId, currentUser.role);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json(user);
        } catch(e) {
            res.status(e.code || e.status || 500).json({ error: e.message });
        }
    };

    getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const currentUser = (req as any).user!;

            if (currentUser.role != UserRole.ADMIN) {
                res.status(403).json({ error: 'Access denied' });
                return;
            };

            const user = await this.UserService.getUsers();

            if (!user) {
                res.status(404).json({ error: "Users not found" });
                return;
            }
            res.json(user);
        } catch(e) {
            res.status(e.code || e.status || 500).json({ error: e.message });
        }
    };

    toggleStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const targetUserId = Number((req as any).params.id);
            const currentUser = (req as any).user!;

            if (currentUser.role != UserRole.ADMIN && currentUser.userId !== targetUserId) {
                res.status(403).json({ error: 'Access denied' });
                return;
            };
            
            const user = await this.UserService.toggleStatus({userId: targetUserId, userRole: currentUser.role});
            res.json(user);

        } catch(e) {
            res.status(e.code || e.status || 500).json({ error: e.message });
            return;
        }
    }

}