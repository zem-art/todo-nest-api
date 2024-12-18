import { z } from "zod";

export const SignInSchemaAdmin = z.object({
    username : z.string().nonempty('username is required'),
    password : z.string().nonempty('password is required'),
})

export type signInAdmin = z.infer<typeof SignInSchemaAdmin>