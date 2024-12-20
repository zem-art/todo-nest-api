import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TodoZod } from './dto/todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel('todo') private readonly TodoModel: Model<any>,
    ) {}

    async handleCreateTodo(todoData: TodoZod) {
        try {
            const { title, description, date, image } = todoData;

            let newTodo = new this.TodoModel({
                ...todoData,
                id_user: "5595368"
            });

            await newTodo.save();

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

    async handleListTodoExist(todoDataParam: any) {
        try {
            const { id_user } = todoDataParam;

            // console.log(id_user);

            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations on successfully list todo exist.',
                response: {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
