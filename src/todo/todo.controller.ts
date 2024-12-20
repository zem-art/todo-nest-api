import { Body, Controller, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoSchema, TodoZod } from './dto/todo.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post('/create')
    async createTodo(@Body(new ZodPipe(TodoSchema)) todoData: TodoZod) {
        return this.todoService.handleCreateTodo(todoData)
    }
}
