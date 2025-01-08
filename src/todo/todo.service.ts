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
            const { title, description, date, image, userId } = todoData;

            const newTodo = new this.TodoModel({
                ...todoData,
                id_user: userId,
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

            const findUser = await this.UserModel.findOne({ id_user })
            if(!findUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)

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

    async handleDetailTodoExist(todoDataParam: any) {
        try {
            const { id_todo } = todoDataParam;

            const findTodo = await this.TodoModel.findOne({ id_todo })
            if(!findTodo) return throwHttpException('failed', 'sorry the todo uid was not found.', HttpStatus.NOT_FOUND)

            const data = {
                id_todo: findTodo.id_todo,
                id_user: findTodo.id_user,
                title: findTodo.title,
                description: findTodo.description,
                date: findTodo.date,
                image: findTodo.image,
                created_at: DateUtil.convertDateToEnglishFormat(DateUtil.formatDateTime(findTodo.created_at, 'DD/MM/YYYY')),
                updated_at: DateUtil.convertDateToEnglishFormat(DateUtil.formatDateTime(findTodo.updated_at, 'DD/MM/YYYY')),
            }

            return {
                status: 'succeed',
                status_code : 200,
                message : `successfully fetched todo data with uid : ${id_todo}`,
                response: {
                    data
                },
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    async handleEditTodoExist(todoData: TodoZod) {
        try {
            const { title, description, date, image, id_todo } = todoData;

            const findTodo = await this.TodoModel.findOne({ id_todo })
            if(!findTodo) return throwHttpException('failed', 'sorry the todo uid was not found.', HttpStatus.NOT_FOUND)

            await this.TodoModel.findOneAndUpdate(
                { id_todo },
                {
                    $set: {
                        ...todoData,
                    }
                },
                { upsert: true }
            )

            return {
                status: 'succeed',
                status_code : 200,
                message : `successfully updated todo data.`,
                response: {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    async handleDeleteTodoTemporary(todoDataParam:any) {
        try {
            const { id_todo } = todoDataParam;

            const findTodo = await this.TodoModel.findOne({ id_todo })
            if(!findTodo) return throwHttpException('failed', 'sorry the todo uid was not found.', HttpStatus.NOT_FOUND)

            if(findTodo.deleted_flag || findTodo.deleted_at) return throwHttpException('failed', 'todo data has been deleted temporarily.', HttpStatus.BAD_REQUEST)

            await this.TodoModel.findOneAndUpdate(
                { id_todo },
                {
                    $set : {
                        deleted_at: new Date(),
                        deleted_flag: true,
                    }
                }
            )

            return {
                status: 'succeed',
                status_code : 200,
                message : `successfully delete temporary todo data with uid : ${id_todo}`,
                response: {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    async handleRecoveryTodoTemporary(todoDataParam:any) {
        try {
            const { id_todo } = todoDataParam;

            const findTodo = await this.TodoModel.findOne({ id_todo })
            if(!findTodo) return throwHttpException('failed', 'sorry the todo uid was not found.', HttpStatus.NOT_FOUND)

            if(findTodo.deleted_flag || findTodo.deleted_at) return throwHttpException('failed', 'todo data has been deleted temporarily.', HttpStatus.BAD_REQUEST)

            await this.TodoModel.findOneAndUpdate(
                { id_todo },
                {
                    $set : {
                        deleted_at: null,
                        deleted_flag: false,
                    }
                }
            )
            
            return {
                status: 'succeed',
                status_code : 200,
                message : `successfully restore todo.`,
                response: {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
