import { Request, Response } from "express";
import { z } from "zod";
import List from "../../../schemas/List";
import { leaveListDtoIn } from "../../../schemas/list.schemas";

export const leaveList = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof leaveListDtoIn>;
    const { id } = dtoIn;

    const userId = req.user?.id;

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (!list.members.includes(userId)) {
      return res.status(400).json({
        message: "User is not a member of this list",
        userId,
      });
    }

    list.members = list.members.filter((m: string) => m !== userId);
    await list.save();

    return res.status(200).json({
      message: "User removed from list",
      id,
      userId,
    });
  } catch (err) {
    console.error("leaveList error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
