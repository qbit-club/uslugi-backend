import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AppStateDocument = HydratedDocument<AppStateClass>

@Schema()
export class AppStateClass {
  @Prop({
    type: [String],
  })
  foodCategory: string[]
}

export const AppStateSchema = SchemaFactory.createForClass(AppStateClass)
