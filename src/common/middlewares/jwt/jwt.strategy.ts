import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configServiceF: ConfigService) {
        const secret = configServiceF.get<string>('jwt.secret');
        // console.log('JWT_SECRET:', secret);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        })
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}