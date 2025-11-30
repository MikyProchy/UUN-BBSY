import { Request, Response } from "express";
import { z } from "zod";
import List, { ItemDto } from "../../../schemas/List";
import { removeItemDtoIn } from "../../../schemas/list.schemas";

export const removeItem = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof removeItemDtoIn>;
    const { id, itemId } = dtoIn;

    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    const before = list.items.length;
    list.items = list.items.filter((i: ItemDto) => i._id !== itemId);

    if (list.items.length === before) {
      return res.status(404).json({ message: "Item not found" });
    }

    await list.save();

    return res.status(200).json({
      ...list.toObject(),
    });
  } catch (err) {
    console.error("removeItem error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
