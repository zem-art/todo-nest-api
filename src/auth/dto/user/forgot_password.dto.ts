import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email : z.string().email({ message: "Invalid email address" }),
    current_password : z.string().nonempty('current_password is required'),
    update_password : z.string().nonempty('update_password is required')
})

export type forgotPasswordZod = z.infer<typeof forgotPasswordSchema>