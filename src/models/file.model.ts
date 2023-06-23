import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

@Schema({timestamps: true})
export class File extends Document {
  @Prop({required: true})
  name: string;

  @Prop()
  data: Buffer;

  @Prop()
  contentType: string;

  @Prop({type: SchemaTypes.ObjectId})
  parentId: ObjectId;
}

export const fileSchema = SchemaFactory.createForClass(File);
