import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class SignInDto {
    @IsEmail({}, { message : 'email must be an email'})
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'password must be longer than or equal to 8 characters' })
    password: string;
}

