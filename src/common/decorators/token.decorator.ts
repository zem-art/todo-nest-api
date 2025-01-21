import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is missing or malformed');
    }

    return authHeader.split(' ')[1]; // Mengambil token setelah "Bearer"
  },
);