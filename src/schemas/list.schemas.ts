import { z } from "zod";
import { UserSchema } from "./user.schemas";

export const ItemSchema = z.object({
  _id: z.uuidv4(),
  listId: z.uuidv4(),
  itemName: z.string(),
  completed: z.boolean(),
});

export const CreateItemDto = z.object({
  itemName: z.string(),
});

export const ListSchema = z.object({
  _id: z.uuidv4(),
  ownerId: z.uuidv4(),
  listName: z.string(),
  dateCreated: z.string(),
  state: z.enum(["active", "archived"]),
  items: z.array(ItemSchema),
  members: z.array(z.string()),
});

// GET
export const getListByIdDtoIn = z.object({
  id: z.uuidv4(),
});

export const getListsDtoIn = z.object({
  archived: z.preprocess((val) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined;
  }, z.boolean().optional()),
});

// DELETE
export const deleteListDtoIn = z.object({
  id: z.uuidv4(),
});

export const leaveListDtoIn = z.object({
  id: z.string(),
});

export const removeItemDtoIn = z.object({
  id: z.uuidv4(),
  itemId: z.uuidv4(),
});

export const removeMemberDtoIn = z.object({
  id: z.uuidv4(),
  memberId: z.string(),
});

// POST
export const createListDtoIn = z.object({
  listName: z.string(),
  items: z.array(CreateItemDto).optional(),
  members: z.array(z.string()).optional(),
});

export const addItemDtoIn = z.object({
  id: z.uuidv4(),
  item: CreateItemDto,
});

export const addMemberDtoIn = z.object({
  id: z.uuidv4(),
  memberId: z.string(),
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
