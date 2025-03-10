import { Body, Controller, Get, HttpCode, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';
import { signUpAdminZod, SignUpAdminSchema } from './dto/admin/sign_up.dto';
import { signInAdminZod, SignInSchemaAdmin } from './dto/admin/sign_in.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { ValidationPipe } from 'src/common/pipes/validator.pipe';
import { JWTAuthGuards } from 'src/common/middlewares/jwt/jwt.guard';
import { ApiVersionedRoute } from 'src/common/decorators/version.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BearerToken } from 'src/common/decorators/token.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    /**
     * 
     * @param signInData DTO Data transfer object sign in class validator
     * @returns 
     */
    @ApiVersionedRoute(`/mobile/user/sign_in`)
    @Post()
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async signInUser(@Body() signInData : SignInDto) {
        return this.authService.handleSignInUser(signInData)
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up class validator
     * @returns 
     */
    @ApiVersionedRoute('/mobile/user/sign_up')
    @Post()
    @UsePipes(ValidationPipe)
    async signUpUser(@Body() signUpData : SignUpDto) {
        return await this.authService.handleSignUpUser(signUpData);
    }


    @ApiVersionedRoute('/mobile/user/profile')
    @Get()
    @HttpCode(200)
    @UseGuards(JWTAuthGuards)
    async profileUser(@Request() req:{ user: JwtPayload }, @BearerToken() token: string) {
        const combinedData = { userId: req.user.userId, email: req.user.email, token: token }
        return await this.authService.handleProfileUser(combinedData)
    }

    /**
     * 
     * @param signInData DTO Data transfer object sign in zod
     * @returns 
     */
    @ApiVersionedRoute('/admin/sign_in')
    @Post()
    @HttpCode(200)
    async signInAdminZod(@Body(new ZodPipe(SignInSchemaAdmin)) signInData : signInAdminZod) {
       return this.authService.handleSignInAdmin(signInData)
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up zod
     * @returns 
     */
    @ApiVersionedRoute('/admin/sign_up')
    @Post()
    async signUpAdminZod(@Body(new ZodPipe(SignUpAdminSchema)) signUpData : signUpAdminZod) {
        return await this.authService.handleSignUpAdmin(signUpData);
    }
}
