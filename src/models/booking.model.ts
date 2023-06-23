import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose , { Document, ObjectId } from 'mongoose';
import { User } from './user.model';
import { Facility } from './facility,model';

enum BookingType{
    RESERVATION = 'RESERVATION',
    BOOKING = 'BOOKING'
}

@Schema({timestamps: true})
export class Booking extends Document {
  @Prop({default: BookingType.RESERVATION})
  type: BookingType;

  @Prop({default: false})
  valid: boolean;

  @Prop()
  dates: [{start: Date, end: Date}];

  @Prop({ type: mongoose.Types.ObjectId , ref: User.name})
  by: ObjectId;

  @Prop()
  subTotal: number;

  @Prop({ type: mongoose.Types.ObjectId , ref: Facility.name})
  facility: mongoose.Types.ObjectId
}

export const bookingSchema = SchemaFactory.createForClass(Booking);

