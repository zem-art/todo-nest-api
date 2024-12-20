import { z } from "zod";

export const TodoSchema = z.object({
    
})

export type TodoZod = z.infer<typeof TodoSchema>