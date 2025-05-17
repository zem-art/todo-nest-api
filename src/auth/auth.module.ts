import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { schemas } from './schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/middlewares/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailsModule } from 'src/mails/mails.module';
import { resolveJwtSecret } from 'src/common/helpers/jwt-config.util';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature(schemas),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = resolveJwtSecret(configService);
        // console.log('JWT secret Module:', secret); // Debugging line to check the secret value

        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
            issuer: configService.get<string>('jwt.issuer'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
