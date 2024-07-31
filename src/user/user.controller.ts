import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { SomeAdminGuard } from 'src/admin/some_admin.guard';
import ApiError from 'src/exceptions/errors/api-error';
import { RolesService } from 'src/roles/roles.service';
import RequestWithUser from 'src/types/request-with-user.type';
import { UserFromClient } from './interfaces/user-from-client.interface';
import { UserClass } from './schemas/user.schema';
import { RestClass } from '../rest/schemas/rest.schema';
import { UserService } from './user.service';
import { GlobalAdminGuard } from 'src/admin/global_admin.guard';
import { Role } from '../roles/interfaces/role.interface';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel('Rest') private RestModel: Model<RestClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,

    private UserService: UserService,
    private RolesService: RolesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('get-by-id')
  async get_by_id(@Query('_id') _id: string) {
    let candidate = await this.UserModel.findById(_id, {
      password: 0,
    }).populate('orders').populate('managerIn');
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден');

    return candidate;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(SomeAdminGuard)
  @Post('change-user')
  async changeUser(
    @Req() req: RequestWithUser,
    @Body('user') user: UserFromClient,
  ) {
    let subject_user = await this.UserModel.findById(user._id);

    // ... Защиты, проверки

    await subject_user.updateOne(user, { runValidators: true });
  }

  @HttpCode(HttpStatus.OK)
  @Get('rests')
  async getUserRests(@Query() query: any) {
    return await this.UserModel.findById(query.userId)
      .populate('rests')
      .select({
        rests: 1,
      });
  }

  // @UseGuards(GlobalAdminGuard)
  @HttpCode(HttpStatus.OK)
  @Post('set-manager')
  async setManager(
    @Body('user_email') user_email: string,
    @Body('chosen_rest') chosen_rest: string,
  ) {
    const user = await this.UserModel.findOne({ email: user_email });

    if (!user) {
      throw new ApiError(404, `User with email ${user_email} not found`);
    }
    await this.RestModel.updateOne(
      { _id: chosen_rest },
      { $addToSet: { managers: user_email } },
    );

    // Check if the user already has a manager role
    const hasManagerRole = user.roles.some((role) => role === 'manager');

    if (hasManagerRole) {
      // User has a manager role, update the existing role
      return await this.UserModel.updateOne(
        { email: user_email },
        {
          $addToSet: { managerIn: chosen_rest },
        },
      );
    } else {
      // User does not have a manager role, add it
      return await this.UserModel.updateOne(
        { email: user_email },
        {
          $push: {
            managerIn: chosen_rest,
            roles: "manager"
          },
         
        },
      );
    }
  }

  // @UseGuards(GlobalAdminGuard)
  @HttpCode(HttpStatus.OK)
  @Post('delete-manager')
  async deleteManager(
    @Req() req: RequestWithUser,
    @Body('manager_email') manager_email: string,
    @Body('restId') restId: string,
  ) {
    await this.UserModel.updateOne(
      { email: manager_email, 'roles': 'manager' },
      { $pull: { 'managerIn': restId } },
    );
    return this.RestModel.updateOne(
      { _id: restId },
      { $pull: { 'managers': manager_email } },
    );
  }

  // async addRole(user_email: string, role_type: string) {
  //   let role: Role = {
  //     type: role_type,
  //     rest_ids: [],
  //   };
  //   return await this.UserModel.updateOne(
  //     { email: user_email, 'role.type': { $nin: [role_type] } },
  //     { $addToSet: { roles: role } },
  //     { runValidators: true },
  //   );
  // }

  // async deleteRole(user_email: string, role_type: string) {
  //   return await this.UserModel.updateOne(
  //     { email: user_email },
  //     { $unset: { 'roles.$[t]': '' } },
  //     { arrayFilters: [{ 't.type': role_type }], runValidators: true },
  //   );
  // }

  @Patch('choose-managing-rest')
  async chooseManagingRests(
    @Body('userId') userId: string,
    @Body('restId') restId: string,
  ) {
    if (!restId) return await this.UserModel.findById(userId);
    return await this.UserModel.findByIdAndUpdate(
      userId,
      { managingRest: restId },
      { new: true },
    );
  }

  @Get('manager-in-array')
  async getManagerInArray(
    @Query('user_id') userId: string
  ) {
    let userFromDb = await this.UserModel.findById(userId).populate({
      path: 'managerIn',
      select: ['title']
    })
    
    return userFromDb.managerIn
  }
}
