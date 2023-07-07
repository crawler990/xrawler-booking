import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from './user.model';

@Schema({timestamps: true})
export class Facility extends Document {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  capacity: number;

  @Prop({required: true})
  type: string;

  @Prop({required: true})
  cost: number;

  @Prop({default: 'KE'})
  currency: string;

  @Prop()
  location: string;

  @Prop({type: {}})
  coordinates: {
    longitude: number,
    latitude: number
  };

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: User.name})
  owner: ObjectId;

  @Prop()
  contact: string;
}

export const facilitySchema = SchemaFactory.createForClass(Facility);

