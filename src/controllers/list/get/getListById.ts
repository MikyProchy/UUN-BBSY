import { Request, Response } from "express";
import List from "../../../schemas/List";
import { z } from "zod";
import { getListByIdDtoIn } from "../../../schemas/list.schemas";

export const getListById = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof getListByIdDtoIn>;
    const { id } = dtoIn;

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({
      ...list.toObject(),
    });
  } catch (err) {
    console.error("getListById error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
