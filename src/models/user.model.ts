import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({trim: true})
  username: string;  
}

export const userSchema = SchemaFactory.createForClass(User);
