import { z } from "zod";
import { UserSchema } from "./user.schemas";

export type UserDto = z.infer<typeof UserSchema>;
