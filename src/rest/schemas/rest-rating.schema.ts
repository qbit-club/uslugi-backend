import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose'

export type RestRatingDocument = HydratedDocument<RestRatingClass>;

@Schema()
export class RestRatingClass {
  @Prop({
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rest',
    required: true
  })
  rest: mongoose.Schema.Types.ObjectId

  @Prop({
    type: Array, 
    default: [
      {
        rating: 1,
        users: []
      },
      {
        rating: 2,
        users: []
      },
      {
        rating: 3,
        users: []
      },
      {
        rating: 4,
        users: []
      },
      {
        rating: 5,
        users: []
      },
    ]
  })
  ratings: any
}

export const RestRatingSchema = SchemaFactory.createForClass(RestRatingClass);
// без этого кастомные методы не будут работать
// RestRatingSchema.loadClass(RestRatingClass);