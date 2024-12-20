import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TodoZod } from './dto/todo.dto';

@Injectable()
export class TodoService {
    constructor() {}
    

    async handleCreateTodo(todoData: TodoZod) {
        try {
            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations on successfully creating todo.',
                response: {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
