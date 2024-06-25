import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';

export type RestDocument = HydratedDocument<RestClass>

@Schema()
export class RestClass {
  @Prop({ 
    type: String, 
    required: true,
    min: 2
  })
  title: string

  @Prop({
    type: Array,
    required: true
  })
  tables: Table[]
}

export const RestSchema = SchemaFactory.createForClass(RestClass)
