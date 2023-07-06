import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from './user.model';

@Schema({timestamps: true})
export class Facility extends Document {
  @Prop()
  name: string;

  @Prop()
  capacity: number;

  @Prop()
  type: string;

  @Prop()
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

