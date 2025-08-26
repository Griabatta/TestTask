import { NextFunction, Response, Request } from "express"
import { UserRole } from "../entities/User"
import jwt from "jsonwebtoken";




export const authToken = (req: Request, res: Response, next: NextFunction) :void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({error: "Access token required"});
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        (req as any).user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email
        };
        next();
    } catch(e) {
        res.status(403).json({ error: 'Invalid or expired token' });
    };

    
}

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!roles.includes((req as any).user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
        }
        next();
    };
};