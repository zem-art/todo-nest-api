import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";
import { throwHttpException } from "../helpers/exceptions/http-exception.util";

@Injectable()
export class ZodPipe implements PipeTransform {
    constructor( private schema: ZodSchema<any>) {}

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value)
        } catch (error) {
            // console.log(error.errors)
            const firstErrorMessage = error.errors?.[0]?.message || 'unknown_message';
            const firstErrorPath = error.errors?.[0]?.path?.[0] || 'unknown_field';
            if (error instanceof ZodError) {
                return throwHttpException(
                    'failed',
                    'invalid input data',
                    400,
                    { path: `invalid fields: ${firstErrorPath}`, message : `${firstErrorMessage}` }
                )
            }
            return throwHttpException(
                'failed',
                'invalid input data',
                400,
                { message: `validation Failed !!...` }
            )
        }
    }
}