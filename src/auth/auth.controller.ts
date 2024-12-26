import { Body, Controller, Get, HttpCode, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';
import { signUpAdminZod, SignUpAdminSchema } from './dto/admin/sign_up.dto';
import { signInAdminZod, SignInSchemaAdmin } from './dto/admin/sign_in.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { ValidationPipe } from 'src/common/pipes/validator.pipe';
import { JWTAuthGuards } from 'src/common/middlewares/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 
     * @param signInData DTO Data transfer object sign in class validator
     * @returns 
     */
    @Post('/user/sign_in')
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
    @Post('/user/sign_up')
    @UsePipes(ValidationPipe)
    async signUpUser(@Body() signUpData : SignUpDto) {
        return await this.authService.handleSignUpUser(signUpData);
    }

    /**
     * 
     * @param signInData DTO Data transfer object sign in zod
     * @returns 
     */
    @Post('/admin/sign_in')
    @HttpCode(200)
    async signInAdminZod(@Body(new ZodPipe(SignInSchemaAdmin)) signInData : signInAdminZod) {
       return this.authService.handleSignInAdmin(signInData)
    }


    /**
     * 
     * @param signUpData DTO Data transfer object sign up zod
     * @returns 
     */
    @Post('/admin/sign_up')
    async signUpAdminZod(@Body(new ZodPipe(SignUpAdminSchema)) signUpData : signUpAdminZod) {
        return await this.authService.handleSignUpAdmin(signUpData);
    }


    @Get('/profile')
    @UseGuards(JWTAuthGuards)
    async profileUser(@Request() req:any) {
        return req.user;
    }
}
