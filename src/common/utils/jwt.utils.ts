import { JwtService } from '@nestjs/jwt';

export class JWTUtil {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(param: any): string {
        return this.jwtService.sign(param);
    }
}
