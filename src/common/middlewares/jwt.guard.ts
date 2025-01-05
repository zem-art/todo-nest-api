import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuards extends AuthGuard('jwt') {}