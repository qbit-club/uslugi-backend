import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { SomeAdminGuard } from 'src/admin/some_admin.guard';
import ApiError from 'src/exceptions/errors/api-error';
import { RolesService } from 'src/roles/roles.service';
import RequestWithUser from 'src/types/request-with-user.type';
import { UserFromClient } from './interfaces/user-from-client.interface';
import { UserClass } from './schemas/user.schema';
import { UserService } from './user.service';
import { GlobalAdminGuard } from 'src/admin/global_admin.guard';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private UserService: UserService,
    private RolesService: RolesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('get-by-id')
  async get_by_id(
    @Query('_id') _id: string,
  ) {
    let candidate = await this.UserModel.findById(_id, { password: 0 })
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден')

    return candidate
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(SomeAdminGuard)
  @Post('change-user')
  async changeUser(
    @Req() req: RequestWithUser,
    @Body('user') user: UserFromClient
  ) {
    let subject_user = await this.UserModel.findById(user._id)

    // ... Защиты, проверки

    await subject_user.updateOne(user, { runValidators: true })
  }

  @HttpCode(HttpStatus.OK)
  @Get('rests')
  async getUserRests(
    @Query() query: any
  ) {
    return await this.UserModel.findById(query.userId).populate('rests').select({
      rests: 1
    })
  }

  // @UseGuards(GlobalAdminGuard)
  @HttpCode(HttpStatus.OK)
  @Post('set-manager')
  async setManagerByAdmin(
    @Req() req: RequestWithUser,
    @Body('user_email') user_email: string,
    @Body('chosen_rest') chosen_rest: string,
  ) {
    await this.UserModel.updateOne({ "email": user_email },
    { $set: { "role.type": "manager" }, $push: { "role.rest_ids": chosen_rest } },
    { runValidators: true })
  }
}
