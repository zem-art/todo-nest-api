import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TodoZod } from './dto/todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwHttpException } from 'src/common/helpers/exceptions/http-exception.util';
import { DateUtil } from 'src/common/utils/date.util';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel('todo') private readonly TodoModel: Model<any>,
        @InjectModel('user') private readonly UserModel: Model<any>,
    ) {}

    async handleCreateTodo(todoData: TodoZod) {
        try {
            const { title, description, date, image } = todoData;
console.log(todoData)
            // let newTodo = new this.TodoModel({
            //     ...todoData,
            //     id_user: "5595368"
            // });

            // await newTodo.save();

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

            const findUser = await this.UserModel.findOne({ id_user })
            if(!findUser) return  throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)

            const findTodo  = await this.TodoModel.find({ id_user, deleted_flag: false })

            let arrayResp = []

            for (let i = 0; i < findTodo.length; i++) {
                const element = findTodo[i];
                arrayResp.push({
                    id_todo: element.id_todo,
                    // id_user: element.id_user,
                    title: element.title,
                    description: element.description,
                    // date: element.date,
                    // image: element.image,
                    completed: element.element,
                    created_at: DateUtil.convertDateToEnglishFormat(DateUtil.formatDateTime(element.created_at, 'DD/MM/YYYY')),
                    updated_at: DateUtil.convertDateToEnglishFormat(DateUtil.formatDateTime(element.updated_at, 'DD/MM/YYYY')),
                })
            }

            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations on successfully list todo exist.',
                response: {
                    data : arrayResp
                },
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
