import { NextFunction, Request, Response } from "express";

export type Profile = "User" | "Owner" | "Member";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      profile: Profile;
    };
  }
}

export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  const profile = (req.header("x-user-profile") as Profile) || "User";

  req.user = {
    id: "00000000-0000-0000-0000-000000000000",
    profile,
  };

  next();
};
