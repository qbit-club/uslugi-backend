import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppStateClass } from './schemas/app-state.schema';

@Injectable()
export class AppStateService {
  constructor(
    @InjectModel('AppState') private AppStateModel: Model<AppStateClass>,
  ) {}

  async createFoodCategory(category) {
    return await this.AppStateModel.updateOne(
      {},
      { $addToSet: { foodCategory: { $each: category } } },
      { upsert: true }, // Создает документ, если его еще нет
    ).sort();
  }
  async deleteFoodCategory(category) {
    await this.AppStateModel.updateOne(
      {},
      { $pull: { foodCategory: category } },
    );
  }
  getAllCategories() {
    return this.AppStateModel.findOne({}, { foodCategory: 1 });
  }

  findOne(id: number) {
    return `This action returns a #${id} appState`;
  }

  update(id: number) {
    return `This action updates a #${id} appState`;
  }

  remove(id: number) {
    return `This action removes a #${id} appState`;
  }
}
