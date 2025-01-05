import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpDto {
    @IsEmail({}, { message : 'email must be an email'})
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(8, { message: 'password must be longer than or equal to 8 characters' })
    password: string;

    @IsString()
    @MinLength(8, { message: 'confirm_password must be longer than or equal to 8 characters' })
    confirm_password: string;
}

