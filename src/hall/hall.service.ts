import { Injectable } from '@nestjs/common';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HallClass } from './schemas/hall.schema';

// interfaces
import { HallFromClient } from './interfaces/hall-from-client.interface';
@Injectable()
export class HallService {
  constructor(
    @InjectModel('Hall') private HallModel: Model<HallClass>,
  ) {}
  create(hall: HallFromClient): Promise<any> {    
    return this.HallModel.create(hall)
  }
}
