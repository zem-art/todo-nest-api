import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin/admin.schema';
import { schemas } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature(schemas)
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
