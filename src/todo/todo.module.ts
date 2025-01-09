import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { schemas } from './schema';
import { CorsMiddleware } from 'src/common/middlewares/cors/cors.middleware';

@Module({
    imports : [
        MongooseModule.forFeature(schemas)
    ],
    controllers: [TodoController],
    providers: [TodoService]
})

export class TodoModule {
    configure(customer: MiddlewareConsumer){
        customer
        .apply(CorsMiddleware)
        .forRoutes({ path : "*", method: RequestMethod.ALL }) // all router module

        // spesification path module
        // .forRoutes(
        //     { path: 'api/v1/resource', method: RequestMethod.GET },
        //     { path: 'api/v1/resource/:id', method: RequestMethod.PUT },
        // );
    }
}
