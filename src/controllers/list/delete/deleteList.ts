import { Request, Response } from "express";
import { z } from "zod";
import List from "../../../schemas/List";
import { deleteListDtoIn } from "../../../schemas/list.schemas";

export const deleteList = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof deleteListDtoIn>;
    const { id } = dtoIn;

    const deleted = await List.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({
      message: "List deleted",
      id,
    });
  } catch (err) {
    console.error("deleteList error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
