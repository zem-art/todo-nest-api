import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    // collection: 'todo'
})
export class Todo {
    @Prop({ index: 1 })
    id_docs : string;

    @Prop({ index: 1, })
    id_todo : string;

    @Prop({ default: ''})
    id_user : string;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    date: string;

    @Prop()
    image: string;

    @Prop({ default: false })
    completed: boolean;

    @Prop({ default: false })
    deleted_flag: boolean;

    @Prop({ type: Date, default: null, required: false })
    deleted_at: Date;

    @Prop({ default : 'open'})
    status: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export type TodoDocument = HydratedDocument<Todo>;

TodoSchema.pre('save', async function (next) {
    try {
        this.id_docs = String(this._id)
        next()
    } catch (error) {
        next(error)
    }
})

