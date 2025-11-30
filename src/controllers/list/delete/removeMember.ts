import { Request, Response } from "express";
import { z } from "zod";
import List from "../../../schemas/List";
import { removeMemberDtoIn } from "../../../schemas/list.schemas";

export const removeMember = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof removeMemberDtoIn>;
    const { id, memberId } = dtoIn;

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const before = list.members.length;
    list.members = list.members.filter((m: string) => m !== memberId);

    if (list.members.length === before) {
      return res.status(404).json({
        message: "Member not found in this list",
        memberId,
      });
    }

    await list.save();

    return res.status(200).json({
      message: "Member removed",
      ...list.toObject(),
    });
  } catch (err) {
    console.error("removeMember error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
