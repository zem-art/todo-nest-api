import { AdminSchema } from "./admin/admin.schema";
import { OtpSchema } from "./user/otp.schema";
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
    {
        name: 'otp',
        schema: OtpSchema,
    },
];