import { Request, Response } from "express";
import List from "../../../schemas/List";
import { z } from "zod";
import { createListDtoIn } from "../../../schemas/list.schemas";

export const createList = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof createListDtoIn>;
    const { listName, items = [], members = [] } = dtoIn;

    const now = new Date().toISOString();
    const listId = crypto.randomUUID();

    const normalizedItems = items.map(({ itemName }) => ({
      itemName,
      _id: crypto.randomUUID(),
      completed: false,
    }));

    const memberIds: string[] = members?.map((m: any) => m._id ?? m.id ?? m);

    const doc = await List.create({
      _id: listId,
      ownerId: req.user?.id,
      listName,
      dateCreated: now,
      state: "active",
      items: normalizedItems,
      members: memberIds,
    });

    return res.status(201).json({
      ...doc.toObject(),
    });
  } catch (err) {
    console.error("createList error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
