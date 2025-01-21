import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoSchema, TodoZod } from './dto/todo.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { JWTAuthGuards } from 'src/common/middlewares/jwt/jwt.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ApiVersionedRoute } from 'src/common/decorators/version.decorator';
import { TodoInterface } from './interface/todo.interface';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @ApiVersionedRoute('/create')
    @Post()
    @UseGuards(JWTAuthGuards)
    async createTodo(@Request() req:{ user: JwtPayload}, @Body(new ZodPipe(TodoSchema)) todoData: TodoZod) {
        const combinedData = { ...todoData, userId: req.user.userId, email: req.user.email };
        return this.todoService.handleCreateTodo(combinedData)
    }

    @ApiVersionedRoute('/list')
    @Get()
    @UseGuards(JWTAuthGuards)
    async listTodoExist(@Request() req:{ user: JwtPayload }, @Query() query: TodoInterface) {
        const combinedData = { id_user: req.user.userId, ...query}
        return this.todoService.handleListTodo(combinedData)
    }

    @ApiVersionedRoute('/detail/:id_todo/exist')
    @Get()
    @UseGuards(JWTAuthGuards)
    async detailTodoExist(
        @Param() params: TodoInterface,
        @Query() query: TodoInterface,
        @Request() req: { user : JwtPayload}
    ) {
        const combinedData = { id_todo: params.id_todo, ...query, id_user: req.user.userId }
        return this.todoService.handleDetailTodoExist(combinedData)
    }

    @ApiVersionedRoute('/edit/:id_todo/exist')
    @Put()
    async editTodoExist(@Param() params: TodoInterface, @Body(new ZodPipe(TodoSchema)) todoData : TodoZod) {
        const combinedData = { ...todoData, id_todo : params.id_todo };
        return this.todoService.handleEditTodoExist(combinedData)
    }

    @ApiVersionedRoute('/delete/:id_todo/temporary')
    @Delete()
    async deleteTemporaryTodo(@Param() params: TodoInterface) {
        return this.todoService.handleDeleteTodoTemporary(params)
    }

    @ApiVersionedRoute('/recovery/:id_todo/temporary')
    @Put()
    async recoveryTemporaryTodo(@Param() params: TodoInterface) {
        return this.todoService.handleRecoveryTodoTemporary(params)
    }
}
