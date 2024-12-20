import { AdminSchema } from "./admin/admin.schema";
import { UserSchema } from "./user/user.schema";

export const schemas = [
    { 
        name: 'admin',
        schema: AdminSchema
    },
    {
        name: 'user',
        schema: UserSchema
    },
];