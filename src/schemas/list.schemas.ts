import { z } from "zod";
import { UserSchema } from "./user.schemas";

export const ListSchema = z.object({
  _id: z.uuidv4(),
  ownerId: z.uuidv4(),
  listName: z.string(),
  dateCreated: z.string(),
  state: z.enum(["active", "archived"]),
});

export const ItemSchema = z.object({
  _id: z.uuidv4(),
  listId: z.uuidv4(),
  itemName: z.string(),
  completed: z.boolean(),
});

// GET
export const getListByIdDtoIn = z.object({
  id: z.uuidv4(),
});

export const getListsDtoIn = z.object({
  archived: z.boolean().optional(),
});

// DELETE
export const deleteListDtoIn = z.object({
  id: z.uuidv4(),
});

export const leaveListDtoIn = z.object({
  id: z.uuidv4(),
});

export const removeItemDtoIn = z.object({
  id: z.uuidv4(),
  itemId: z.uuidv4(),
});

export const removeMemberDtoIn = z.object({
  id: z.uuidv4(),
  memberId: z.uuidv4(),
});

// POST
export const createListDtoIn = z.object({
  listName: z.string(),
  items: z.array(ItemSchema).optional(),
  members: z.array(UserSchema).optional(),
});

export const addItemDtoIn = z.object({
  id: z.uuidv4(),
  item: ItemSchema,
});

export const addMemberDtoIn = z.object({
  id: z.uuidv4(),
  memberId: z.uuidv4(),
});

// PATCH
export const archiveListDtoIn = z.object({
  id: z.uuidv4(),
});

export const renameListDtoIn = z.object({
  id: z.uuidv4(),
  listName: z.string(),
});

export const toggleItemStatusDtoIn = z.object({
  id: z.uuidv4(),
  itemId: z.uuidv4(),
});

export const restoreArchivedListDtoIn = z.object({
  id: z.uuidv4(),
});
