import { Request, Response } from "express";
import { archiveListDtoIn } from "../../../schemas/list.schemas";
import { z } from "zod";
import List from "../../../schemas/List";

export const archiveList = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof archiveListDtoIn>;
    const { id } = dtoIn;

    const updated = await List.findByIdAndUpdate(
      id,
      { state: "archived" },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({
      ...updated.toObject(),
    });
  } catch (err) {
    console.error("archiveList error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
