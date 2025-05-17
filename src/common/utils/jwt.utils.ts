import { JwtService } from '@nestjs/jwt';

export class JWTUtil {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(param: any): string {
        // console.log('JWTUtil param:', param); // Debugging line to check the param value
        return this.jwtService.sign(param);
    }
}
