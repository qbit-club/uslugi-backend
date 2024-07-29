import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import type { Role } from '../../roles/interfaces/role.interface';
import { RestClass } from '../../rest/schemas/rest.schema';
import { RestSchema } from '../../rest/schemas/rest.schema';
export type UserDocument = HydratedDocument<UserClass>;

const RestModel = mongoose.model<RestClass>('Rest', RestSchema);

@Schema()
export class UserClass {
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  roles: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rest' }],
    default: [],
    required: false,
  })
  managerIn: mongoose.Schema.Types.ObjectId[];
  
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rest' }],
    default: [],
  })
  rests: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    default: [],
  })
  orders: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(UserClass);

// // Add a virtual method to populate restaurant details for the manager role
// UserSchema.virtual('managerRests').get(async function () {
//   const managerRole = this.roles.find((role) => role.type === 'manager');
//   if (managerRole && managerRole.rest_ids.length > 0) {
//     // Ensure `rest_ids` is accessible and of the correct type
//     const restIds = managerRole.rest_ids as mongoose.Types.ObjectId[];
//     const restaurants = await RestModel.find({
//       _id: { $in: restIds },
//     }).populate('title').exec();
//     return restaurants;
//   }
//   return [];
// });
