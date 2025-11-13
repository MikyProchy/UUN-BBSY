import { z } from "zod";
import { ItemSchema, ListSchema } from "./list.schemas";

export type ListDto = z.infer<typeof ListSchema>;
export type ItemDto = z.infer<typeof ItemSchema>;
