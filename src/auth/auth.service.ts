import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';
import { signUpAdmin } from './dto/admin/sign_up.dto';
import { signInAdmin } from './dto/admin/sign_in.dto';
import { StringUtil } from 'src/common/utils/string.util';
import { throwHttpException } from 'src/common/helpers/exceptions/http-exception.util';

@Injectable()
export class AuthService {
    constructor(
       @InjectModel('admin') private readonly AdminModel: Model<any>,
    ){}
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
        try {
            const { username, password } = signInData

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
            const { username, email, password, confirm_password } = signUpData

            if(StringUtil.special_character_username(username))
                return throwHttpException(
                    'failed',
                    'sorry username cannot contain special characters.',
                    HttpStatus.BAD_REQUEST
                )

            const existingUser = await this.AdminModel.findOne({ email: email });
            if(existingUser) return throwHttpException('failed', 'email already registered', HttpStatus.CONFLICT)
            
            let newAdmin = new this.AdminModel({
                ...signUpData,
            });

            // Save DB
            await newAdmin.save();

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
