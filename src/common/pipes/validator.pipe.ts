import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { throwHttpException } from "../helpers/exceptions/http-exception.util";

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!metatype  || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorResponse = errors.map(err => ({
                path : `invalid fields: ${err.property}`,
                message : Object.values(err.constraints || {})[0]
            }));
            // console.log(errorResponse)
            return throwHttpException(
                'failed',
                'invalid input data',
                400,
                { ...errorResponse[0] }
            )
        }

        return value;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}