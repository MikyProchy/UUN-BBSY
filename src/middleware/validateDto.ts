import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    dtoIn?: any;
  }
}

export const validateDto =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const input = {
      ...req.params,
      ...req.query,
      ...req.body,
    };

    const result = schema.safeParse(input);

    if (!result.success) {
      return res.status(400).json({
        message: "Input data is not valid.",
        details: z.treeifyError(result.error),
      });
    }

    req.dtoIn = result.data;
    next();
  };
