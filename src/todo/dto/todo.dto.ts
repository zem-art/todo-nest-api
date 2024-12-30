import { z } from "zod";

export const TodoSchema = z.object({
    userId: z.string().optional(), // Diambil dari token
    email: z.string().email().optional(),  // Diambil dari token
    title: z.string().min(2, {}),
    description: z.string().min(5, { message: 'Content must be at least 5 characters'}),
    date : z.string().max(12, { message: 'Date must contain at most 12 character'}),
    image: z.string(),
})

export type TodoZod = z.infer<typeof TodoSchema>