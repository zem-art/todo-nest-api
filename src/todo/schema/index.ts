import { AdminSchema } from "src/auth/schema/admin/admin.schema";
import { TodoSchema } from "./todo.schema";
import { UserSchema } from "src/auth/schema/user/user.schema";

export const schemas = [
    {
        name: 'todo',
        schema : TodoSchema
    },
    {
        name: 'admin',
        schema: AdminSchema,
    },
    {
        name: 'user',
        schema: UserSchema,
    }
]