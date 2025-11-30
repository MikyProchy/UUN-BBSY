import { Request, Response } from "express";
import { z } from "zod";
import { addItemDtoIn } from "../../../schemas/list.schemas";
import List from "../../../schemas/List";

export const addItem = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof addItemDtoIn>;
    const { id, item } = dtoIn;

    const newItem = {
      _id: crypto.randomUUID(),
      itemName: item.itemName,
      completed: false,
    };

    const updated = await List.findByIdAndUpdate(
      id,
      { $push: { items: newItem } },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({
      ...updated.toObject(),
    });
  } catch (err) {
    console.error("addItem error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
