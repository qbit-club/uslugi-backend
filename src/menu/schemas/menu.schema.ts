import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type MenuDocument = HydratedDocument<MenuClass>

@Schema()
export class MenuClass {
  @Prop({
    type: String,
    required: true,
  })
  title: string
}

export const MenuSchema = SchemaFactory.createForClass(MenuClass)
