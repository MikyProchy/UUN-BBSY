import { Request, Response } from "express";
import List from "../../../schemas/List";
import { getListsDtoIn } from "../../../schemas/list.schemas";
import { z } from "zod";

export const getLists = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof getListsDtoIn>;
    const filter: any = {};

    if (dtoIn.archived !== true) {
      filter.state = "active";
    }

    const lists = await List.find(filter).sort({ dateCreated: -1 });

    return res.status(200).json({
      data: lists,
      count: lists.length,
    });
  } catch (err) {
    console.error("getLists error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
