import * as bcrypt from "bcrypt";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

/**
 * NOTE :
 * schema.collection
 * 1. Opsional, defaultnya plural dari nama class
 * 2. Custom collection name di MongoDB
 */
@Schema({
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    // collection: 'admin',
})
export class Admin {
    @Prop()
    id_docs : string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    confirm_password: string;

    /**
     * @param password 
     * @returns 
     * This function is an async method, which means it will return a Promise.
     */
    async isValidPassword(password:string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
export type AdminDocument = HydratedDocument<Admin>;

AdminSchema.pre('save', async function (next) {
    /**
     * Here it first checks whether the document is new by using mongoose .isNew helper, 
     * therefore, this.isNew is true if the document is new or has changes, 
     * otherwise false, and we only want to hash the password if the document is new, 
     * otherwise it will hash the password again if you save the document again by making some changes in other columns if your document contains other columns.
     */
    try {
  
      // Check if the password has been modified or is new
      if(!this.isModified('password')){
        return next();
      }
      
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
      this.id_docs = String(this._id)
  
      next()
    } catch (error) {
      next(error)
    }
})

/**
 * @param password 
 * @returns 
 * This function is an async method, which means it will return a Promise.
 */
AdminSchema.methods.isValidPassword = async function (password:string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}