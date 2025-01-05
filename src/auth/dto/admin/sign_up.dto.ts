import { z } from 'zod';

export const SignUpAdminSchema = z.object({
    username: z.string().min(3, 'username is required'),
    email : z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .nonempty("Password cannot be empty"),
    confirm_password: z
        .string()
        .nonempty("Confirm password cannot be empty"),
})
.refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Lokasi error di confirm_password
});

export type signUpAdminZod = z.infer<typeof SignUpAdminSchema>;