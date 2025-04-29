import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('smtp.host'),
                    port: configService.get<number>('smtp.port'),
                    secure: configService.get<boolean>('smtp.secure'), // true for 465, false for other ports
                    auth: {
                        user: configService.get<string>('smtp.user'),
                        pass: configService.get<string>('smtp.pass'),
                    }
                },
                defaults: {
                    from: configService.get<string>('smtp.from'),
                },
                }),
            inject: [ConfigService],
        }),
    ],
    exports: [MailerModule],
})

export class MailerConfigModule {}
