import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { resolveJwtSecret } from "src/common/helpers/jwt-config.util";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secret = resolveJwtSecret(configService);
        // console.log('JWT secret Strategy:', secret); // Debugging line to check the secret value

        // Pastikan nilai secret ada
        if (!secret) {
            throw new Error('JWT secret is not defined in environment variables');
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