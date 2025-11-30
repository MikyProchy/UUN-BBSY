import { Request, Response } from "express";
import { z } from "zod";
import List from "../../../schemas/List";
import { renameListDtoIn } from "../../../schemas/list.schemas";

export const renameList = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof renameListDtoIn>;
    const { id, listName } = dtoIn;

    const updated = await List.findByIdAndUpdate(
      id,
      { listName },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({
      ...updated.toObject(),
    });
  } catch (err) {
    console.error("renameList error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
