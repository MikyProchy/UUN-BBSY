import { Request, Response } from "express";

export const restoreArchivedList = (req: Request, res: Response) => {
  return res.status(501).json({
    message: "This endpoint is not yet implemented.",
    body: { ...req.body, ...req.query, ...req.params },
  });
};
