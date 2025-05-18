import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email : z.string().email({ message: "Invalid email address" }),
    current_password : z.string({ message: "current_password is required" }).optional(),
    update_password : z.string().nonempty('update_password is required')
})


export const verifyCodeOtpSchema = z.object({
    email : z.string().email({ message: "Invalid email address" }),
    otp_code : z.string().nonempty('code is required'),
})

export type forgotPasswordZod = z.infer<typeof forgotPasswordSchema>
export type verifyCodeOtpZod = z.infer<typeof verifyCodeOtpSchema>