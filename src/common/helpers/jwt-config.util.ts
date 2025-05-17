import { ConfigService } from "@nestjs/config";

// jwt-config.util.ts
export function resolveJwtSecret(configService: ConfigService): string {
    const env = configService.get<string>('appFastify.env');
    const secret =
      env === 'production' || env === 'prod'
        ? configService.get<string>('jwt.secret_prod')
        : configService.get<string>('jwt.secret_dev');
  
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }
  
    return secret;
}
  