import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
export enum UserRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({ error: "Email not verified" });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length > 0 && !roles.includes(req.user.role as UserRoles)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { auth };
