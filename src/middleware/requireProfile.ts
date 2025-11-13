import { Profile } from "./auth";
import { NextFunction, Request, Response } from "express";

export const requireProfile =
  (...authorizedRoles: Profile[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "User is not authenticated.",
      });
    }

    if (!authorizedRoles.includes(user.profile)) {
      return res.status(403).json({
        message: "User is not authorized for this operation.",
      });
    }

    next();
  };
