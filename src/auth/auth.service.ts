import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';
import { signUpAdmin } from './dto/admin/sign_up.dto';
import { signInAdmin } from './dto/admin/sign_in.dto';

@Injectable()
export class AuthService {
    constructor(){}
    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    async handleSignInUser(signInData: SignInDto) {
        try {
            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations, you have successfully logged in user.',
                response : '',
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up
     * @returns 
     */
    async handleSignUpUser(signUpData: SignUpDto) {
        try {
            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations, you have successfully sign up user.',
                response : '',
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    async handleSignInAdmin(signInData: signInAdmin) {
        console.log(signInData)
        try {
            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations, you have successfully logged in admin.',
                response : '',
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up
     * @returns 
     */
    async handleSignUpAdmin(signUpData: signUpAdmin) {
        try {
            return {
                status: 'succeed',
                status_code : 201,
                message : 'congratulations, you have successfully sign up admin.',
                response : '',
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
