import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose'

export type StudioDocument = HydratedDocument<StudioClass>;

@Schema()
export class StudioClass {
  @Prop({
    type: String
  })
  title: string

  @Prop({
    type: Array,
  })
  weekdays:
    {
      weekday: string,
      from: string,
      to: string,
      holiday: boolean
    }[]
}

export const StudioSchema = SchemaFactory.createForClass(StudioClass);
// без этого кастомные методы не будут работать
// RestRatingSchema.loadClass(RestRatingClass);