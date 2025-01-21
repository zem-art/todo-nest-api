import * as dotenv from 'dotenv';
import { SetMetadata } from '@nestjs/common';
import { API_VERSION } from '../constants/variable.constants';
dotenv.config();

export function ApiVersionedRoute(
    routePrefix: string,
    version?: string // The version parameter is optional
): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        const apiVersion = version || process.env.NEST_APP_VERSION_F || API_VERSION;

        // Combine version with routePrefix
        const fullPath = `${apiVersion}${routePrefix}`;

        // Set path metadata to controller method
        SetMetadata('path', fullPath)(target, propertyKey, descriptor);

        return descriptor;
    };
}
