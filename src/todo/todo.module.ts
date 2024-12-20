import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { schemas } from './schema';

@Module({
    imports : [
        MongooseModule.forFeature(schemas)
    ],
    controllers: [TodoController],
    providers: [TodoService]
})
export class TodoModule {}
