import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HallDocument = HydratedDocument<HallClass>

@Schema()
export class HallClass {
  @Prop({ 
    type: String, 
    required: true,
    min: 2
  })
  title: string
}

export const HallSchema = SchemaFactory.createForClass(HallClass)
