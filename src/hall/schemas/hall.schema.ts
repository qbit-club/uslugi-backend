import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';

export type HallDocument = HydratedDocument<HallClass>

@Schema()
export class HallClass {
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

export const HallSchema = SchemaFactory.createForClass(HallClass)
