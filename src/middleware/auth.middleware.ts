import { NextFunction, Response, Request } from "express"
import { UserRole } from "../entities/User"
import jwt from "jsonwebtoken";




export const authToken = (req: Request, res: Response, next: NextFunction) :void => {
    const token = req.cookies?.auth_token;
    console.log(req.cookies)
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            email: decoded.email
        };
        next();
    } catch(e) {
        res.status(403).json({ error: 'Invalid or expired token' });
    };

    
}

export const setAuthCookie = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (user) {
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role,
                email: user.email 
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ user });
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    };
};