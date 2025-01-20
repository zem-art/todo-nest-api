import { ConfigService } from '@nestjs/config';
import { SetMetadata } from '@nestjs/common';

export function ApiVersionedRoute(
    routePrefix: string,
    version?: string // Parameter version bersifat opsional
): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        // Jika version tidak diberikan, ambil dari ConfigService
        const configService = new ConfigService();
        const apiVersion = version || configService.get<string>('appFastify.version') || process.env.NEST_APP_VERSION_F || 'v1';

        // Gabungkan versi dengan routePrefix
        const fullPath = `${apiVersion}${routePrefix}`;

        // Tetapkan metadata path ke controller method
        SetMetadata('path', fullPath)(target, propertyKey, descriptor);

        return descriptor;
    };
}
