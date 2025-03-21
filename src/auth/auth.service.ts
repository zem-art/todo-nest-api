import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignInDto } from './dto/user/sign_in.dto';
import { SignUpDto } from './dto/user/sign_up.dto';
import { signUpAdminZod } from './dto/admin/sign_up.dto';
import { signInAdminZod } from './dto/admin/sign_in.dto';
import { StringUtil } from 'src/common/utils/string.util';
import { throwHttpException } from 'src/common/helpers/exceptions/http-exception.util';
import { RandomStrUtil } from 'src/common/utils/random_str.utils';
import { JwtService } from '@nestjs/jwt';
import { JWTUtil } from 'src/common/utils/jwt.utils';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
       @InjectModel('admin') private readonly AdminModel: Model<any>,
       @InjectModel('user') private readonly UserModel: Model<any>,
       private readonly jwtService: JwtService,
    ){}
    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    async handleSignInUser(signInData: SignInDto) {
        try {
            const { email, password } = signInData
            let response:object = {}

            const findUsers = await this.UserModel.findOne({ email : email });
            if(!findUsers) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)   

            const isMatchPassword = await findUsers.isValidPassword(password)
            if(!isMatchPassword) return throwHttpException('failed', 'sorry the password is not the same or wrong.', HttpStatus.BAD_REQUEST)
            
            const payload = { sub: findUsers.id_user, payload: String(new Date().getTime()) };

            response = {
                data : {
                    id_user: findUsers.id_user,
                    username: findUsers.username,
                    email: findUsers.email,
                },
                token : new JWTUtil(this.jwtService).generateToken({...payload})
            }

            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations, you have successfully logged in user.',
                response,
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
        const { username, email, password, confirm_password } = signUpData

        if(password !== confirm_password) return throwHttpException('failed', 'sorry, password and password confirmation are not the same.', HttpStatus.BAD_REQUEST, {})

        if(StringUtil.special_character_username(username)) return throwHttpException('failed', 'sorry username cannot contain special characters.', HttpStatus.BAD_REQUEST)

        const existingUser = await this.UserModel.findOne({ email: email });
        if(existingUser) return throwHttpException('failed', 'email already registered', HttpStatus.CONFLICT)

        let newUser = new this.UserModel({
            ...signUpData,
            id_user : `${RandomStrUtil.random_str_alphanumeric(7)}${RandomStrUtil.random_str_number(7)}`,
        });

        // Save DB
        await newUser.save();

        try {
            return {
                status: 'succeed',
                status_code : 201,
                message : 'congratulations, you have successfully sign up user.',
                response : {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param paramsData DTO Data transfer object jwt and token
     * @returns 
     */
    async handleProfileUser (paramsData: JwtPayload & { token?:string }) {
        let response:object = {}
        const { userId, email, token } = paramsData

        const findUsers = await this.UserModel.findOne({ id_user : userId });
        if(!findUsers) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)

        response = {
            data : {
                id_user: findUsers.id_user,
                username: findUsers.username,
                email: findUsers.email,
            },
            token,
        }
        
        try {
            
            return {
                status: 'succeed',
                status_code : 200,
                message : 'the user is successfully identified through the token.',
                response,
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
    async handleSignInAdmin(signInData: signInAdminZod) {
        try {
            const { username, password } = signInData
            let response = {}

            const findAdmin = await this.AdminModel.findOne({ username : username });
            if(!findAdmin) return throwHttpException('failed', 'sorry admin not found or recognize.', HttpStatus.NOT_FOUND)    

            const isMatchPassword = await findAdmin.isValidPassword(password)
            if(!isMatchPassword) return throwHttpException('failed', 'sorry the password is not the same or wrong.', HttpStatus.BAD_REQUEST)

            const payload = { sub: findAdmin.id_user, payload: String(new Date().getTime()) };
                
            response = {
                data : {
                    id_user: findAdmin.id_user,
                    username: findAdmin.username,
                    email: findAdmin.email,
                },
                token : new JWTUtil(this.jwtService).generateToken({...payload})
            }

            return {
                status: 'succeed',
                status_code : 200,
                message : 'congratulations, you have successfully logged in admin.',
                response,
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
    async handleSignUpAdmin(signUpData: signUpAdminZod) {
        try {
            const { username, email, password, confirm_password } = signUpData

            if(StringUtil.special_character_username(username))
                return throwHttpException(
                    'failed',
                    'sorry username cannot contain special characters.',
                    HttpStatus.BAD_REQUEST
                )

            const existingUser = await this.AdminModel.findOne({ $or : [ { email: email }, { username : username }] });
            if(existingUser) return throwHttpException('failed', 'email or username already registered', HttpStatus.CONFLICT)
            
            let newAdmin = new this.AdminModel({
                ...signUpData,
                id_user : `${RandomStrUtil.random_str_alphanumeric(7)}${RandomStrUtil.random_str_number(7)}`,
            });

            // Save DB
            await newAdmin.save();

            return {
                status: 'succeed',
                status_code : 201,
                message : 'congratulations, you have successfully sign up admin.',
                response : {},
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}