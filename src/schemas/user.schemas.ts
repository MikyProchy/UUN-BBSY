import { z } from "zod";

export const UserSchema = z.object({
  _id: z.uuidv4(),
  fullName: z.string(),
  email: z.email(),
});
