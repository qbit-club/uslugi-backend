import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserClass>

@Schema()
export class UserClass {
  @Prop({
    type: String,
    required: true,
    min: 2
  })
  name: string

  @Prop({
    type: String,
    required: true,
  })
  email: string

  @Prop({
    type: String,
    required: true,
  })
  password: string

  @Prop({
    type: [String],
    default: [],
    required: false
  })
  roles: string[]

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rest' }],
    default: [],
  })
  rests: mongoose.Schema.Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(UserClass)
