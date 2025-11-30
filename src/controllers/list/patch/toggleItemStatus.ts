import { Request, Response } from "express";
import { z } from "zod";
import List, { ItemDto } from "../../../schemas/List";
import { toggleItemStatusDtoIn } from "../../../schemas/list.schemas";

export const toggleItemStatus = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof toggleItemStatusDtoIn>;
    const { id, itemId } = dtoIn;

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const item = list.items.find((i: ItemDto) => i._id === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Toggle completed
    item.completed = !item.completed;

    await list.save();

    return res.status(200).json({
      ...list.toObject(),
    });
  } catch (err) {
    console.error("toggleItemStatus error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
