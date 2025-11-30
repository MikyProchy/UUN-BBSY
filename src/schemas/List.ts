import { z } from "zod";
import { ItemSchema, ListSchema } from "./list.schemas";
import mongoose, { Schema, Document } from "mongoose";

export type ListDto = z.infer<typeof ListSchema>;
export type ItemDto = z.infer<typeof ItemSchema>;

const listItemSchema = new Schema<ItemDto>({
  _id: { type: String, required: true },
  itemName: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const listSchema = new Schema<ListDto>({
  _id: { type: String, required: true },
  ownerId: { type: String, required: true },
  listName: { type: String, required: true },
  dateCreated: { type: String, required: true },
  state: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  items: { type: [listItemSchema], default: [] },
  members: { type: [String], default: [] },
});

export default mongoose.models.ShoppingList ||
  mongoose.model<ListDto>("ShoppingList", listSchema);
