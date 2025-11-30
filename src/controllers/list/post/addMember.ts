import { Request, Response } from "express";
import List from "../../../schemas/List";
import { addMemberDtoIn } from "../../../schemas/list.schemas";
import { z } from "zod";

export const addMember = async (req: Request, res: Response) => {
  try {
    const dtoIn = req.dtoIn as z.infer<typeof addMemberDtoIn>;
    const { id, memberId } = dtoIn;

    console.log(req);

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.members.includes(memberId)) {
      return res.status(400).json({ message: "Member already exists" });
    }

    list.members.push(memberId);
    await list.save();

    return res.status(200).json({
      ...list.toObject(),
    });
  } catch (err) {
    console.error("addMember error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
