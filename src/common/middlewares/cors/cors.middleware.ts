import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from "fastify";

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    private allowedOrigins = ['https://example.com', 'https://anotherdomain.com'];

    use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        const origin = req.headers.origin;

        // if (origin && this.allowedOrigins.includes(origin)) {
        //     res.header('Access-Control-Allow-Origin', origin);
        // } else {
        //     res.header('Access-Control-Allow-Origin', ''); // Atur jika domain tidak diizinkan
        // }

        // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (origin && this.allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Credentials', 'true');
        }
  
        next();
    }
}
