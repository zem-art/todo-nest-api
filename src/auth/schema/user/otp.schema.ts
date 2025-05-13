import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    // collection: 'otp'
})
export class Otp {
    @Prop({ index: 1 })
    id_docs : string;

    // @Prop({ index: 1, })
    // id_otp : string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    otp_code: string;

    @Prop({ default: false })
    verified: boolean;

    @Prop({ required: true }) // reset password // verify email
    type: string;

    @Prop({ required : true, index: { expires : 0 }, }) // TTL field
    expires_at: Date;

    @Prop({ default: 0 }) // jumlah percobaan
    attempts: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = HydratedDocument<Otp>;

OtpSchema.pre('save', async function (next) {
    try {
        this.id_docs = String(this._id)
        next()
    } catch (error) {
        next(error)
    }
})

