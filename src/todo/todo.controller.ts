import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoSchema, TodoZod } from './dto/todo.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { JWTAuthGuards } from 'src/common/middlewares/jwt.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post('/create')
    @UseGuards(JWTAuthGuards)
    async createTodo(@Request() req:{ user: JwtPayload}, @Body(new ZodPipe(TodoSchema)) todoData: TodoZod) {
        const combinedData = { ...todoData, userId: req.user.userId, email: req.user.email };
        return this.todoService.handleCreateTodo(combinedData)
    }

    @Get('/list/:id_user/exist')
    async listTodoExist(@Param() params: any) {
        return this.todoService.handleListTodoExist(params)
    }

    @Get('/detail/:id_todo/exist')
    async detailTodoExist(@Param() params: any) {
        return this.todoService.handleDetailTodoExist(params)
    }

    @Put('/edit/:id_todo/exist')
    async editTodoExist(@Param() params: any, @Body(new ZodPipe(TodoSchema)) todoData : TodoZod) {
        const combinedData = { ...todoData, id_todo : params.id_todo };
        return this.todoService.handleEditTodoExist(combinedData)
    }

    @Delete('/delete/:id_todo/temporary')
    async deleteTemporaryTodo(@Param() params: any) {
        return this.todoService.handleDeleteTodoTemporary(params)
    }

    @Put('/recovery/:id_todo/temporary')
    async recoveryTemporaryTodo(@Param() params: any) {
        return this.todoService.handleRecoveryTodoTemporary(params)
    }
}
