import * as bcrypt from "bcrypt";
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
import { forgotPasswordZod, verifyCodeOtpZod } from './dto/user/forgot_password.dto';
import { MailsService } from "src/mails/mails.service";
import { ConfigService } from "@nestjs/config";
import { verify } from "crypto";

@Injectable()
export class AuthService {
    constructor(
       @InjectModel('admin') private readonly AdminModel: Model<any>,
       @InjectModel('user') private readonly UserModel: Model<any>,
       @InjectModel('otp') private readonly OtpModel: Model<any>,
       private readonly jwtService: JwtService,
       private readonly mailerService: MailsService,
       private readonly configService: ConfigService,
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
            
            const payload = { 
                sub: findUsers.id_user,
                payload: new Date().getTime()
            };

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
     * @param forgotPassword DTO Data transfer object forgot password zod
     * @param req Request object
     * @returns 
     */
    async handleForgotPasswordUser(forgotPassword: forgotPasswordZod) {
        try {
            const { email, current_password, update_password } = forgotPassword
            let response:object = {}

            const existingUser = await this.UserModel.findOne({ email: email });
            if(!existingUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND);
            if(current_password !== existingUser.confirm_password) return throwHttpException('failed', 'sorry, password and password confirmation are not the same.', HttpStatus.BAD_REQUEST);
            if(update_password === current_password) return throwHttpException('failed', 'sorry, password and password confirmation are not the same.', HttpStatus.BAD_REQUEST);

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(update_password, salt)

            await this.UserModel.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        password: hashedPassword,
                        confirm_password: update_password,
                    }
                },
                { new: true }
            )

            return {
                status: 'succeed',
                status_code : 200,
                message : `congratulations, you have successfully updated your password.`,
                response: response
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param forgotPassword DTO Data transfer object forgot password zod
     * @param req Request object
     * @returns 
     */
    async handleResetPasswordUser(forgotPassword: forgotPasswordZod) {
        try {
            const { email, current_password, update_password } = forgotPassword
            let response:object = {}

            const existingUser = await this.UserModel.findOne({ email: email });
            if(!existingUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND);

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(update_password, salt)

            await this.UserModel.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        password: hashedPassword,
                        confirm_password: update_password,
                    }
                },
                { upsert: true }
            )

            return {
                status: 'succeed',
                status_code : 200,
                message : `congratulations, you have successfully updated your password.`,
                response: response
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param email User email
     * @param type Type of otp
     * @returns 
     */
    async handleSendOtpEmail (email:string) {
        try {

            const existingUser = await this.UserModel.findOne({ email: email });
            if(!existingUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND);

            // console.log('existingUser', existingUser);
            const time = this.configService.get<number>('resend.timeout');
            const GenerateOtp = RandomStrUtil.random_str_number(6)
            const expiresAt = new Date(Date.now() + time * 60 * 1000) // for minutes

            const payload = {
                name : existingUser.username,
                otp : GenerateOtp,
                time_minutes : time,
                company_team : "Boba"
            }

            await this.mailerService.sendEmailByEvent(
                'password_reset',
                existingUser.email,
                "OTP Code Password",
                payload
            );

            // Membuat OTP dengan masa aktif 5 menit
            const otp = new this.OtpModel({
                email: existingUser.email,
                otp_code: GenerateOtp,
                type: 'reset_password_user',
                expires_at: expiresAt,
            });

            await otp.save();
            
            let response:object = {}

            return {
                status: 'succeed',
                status_code : 200,
                message : `congratulations, you have successfully sent a reset password email.`,
                response: response
            }

        } catch (error:any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }


    /**
     * 
     * @param verifyCode DTO Data transfer object verify code otp zod
     * @param req Request object
     * @returns 
     */
    async handleVerifyCodeOtp (verifyCode : verifyCodeOtpZod) {
        try {
            const { email, otp_code } = verifyCode

            const existingUser = await this.UserModel.findOne({ email: email});
            if(!existingUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND);
            const findOtp = await this.OtpModel.findOne({ email: email, otp_code: otp_code });

            if(!findOtp) return throwHttpException('failed', 'sorry otp code not found or recognize.', HttpStatus.NOT_FOUND);
            if(findOtp.verified || findOtp.verify_at) return throwHttpException('failed', 'sorry otp code already verified.', HttpStatus.BAD_REQUEST);
            
            const expires_at = findOtp.expires_at;
            const currentDate = new Date();
            // Check if the OTP has expired
            const timeRemaining = new Date(expires_at).getTime() - currentDate.getTime();
            const newExpireAt = new Date(currentDate.getTime() + timeRemaining / 2);

            await this.OtpModel.findOneAndUpdate(
                { email: email, otp_code: otp_code },
                {
                    $set: {
                        verified: true,
                        verify_at: new Date(),
                        expires_at: newExpireAt, // update the expiration time
                    }
                },
                { new: true }
            )

            let response:object = {}

            return {
                status: 'succeed',
                status_code : 200,
                message : `congratulations, you have successfully verified the OTP.`,
                response: response
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param email User email
     * @returns 
     */
    async handleCheckExistUser(email: string) {
        try {
            let response:object = {}

            const findUsers = await this.UserModel.findOne({ email : email });
            if(!findUsers) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)

            return {
                status: 'succeed',
                status_code : 200,
                message : 'the user is successfully identified through the email.',
                response,
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