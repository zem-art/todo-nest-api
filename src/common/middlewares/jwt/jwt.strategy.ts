import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        let secret = configService.get<string>('jwt.secret_dev');
        const envFastify = configService.get<string>('appFastify.env');

        if (envFastify === "production" || envFastify === "prod") {
            secret = configService.get<string>('jwt.secret_prod');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        })
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}