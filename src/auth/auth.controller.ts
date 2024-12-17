import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    @Post('/user/sign_in')
    @HttpCode(200)
    async signInUser(@Body() signInData : SignInDto) {
       return this.authService.handleSignInUser(signInData)
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up
     * @returns 
     */
    @Post('/user/sign_up')
    async signUpUser(@Body() signUpData : SignUpDto) {
        return await this.authService.handleSignUpUser(signUpData);
    }

    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    @Post('/admin/sign_in')
    async signInAdmin(@Body() signInData : SignInDto) {
       return this.authService.handleSignInAdmin(signInData)
    }


    /**
     * 
     * @param signUpData DTO Data transfer object sign up
     * @returns 
     */
    @Post('/admin/sign_up')
    async signUpAdmin(@Body() signUpData : SignUpDto) {
        return await this.authService.handleSignUpAdmin(signUpData);
    }
}
