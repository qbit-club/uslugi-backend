import { Injectable } from '@nestjs/common';

// MongoDb
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestRatingClass } from './schemas/rest-rating.schema'
import { RestClass } from './schemas/rest.schema'

// types

@Injectable()
export class RestService {
  constructor(
    @InjectModel('RestRating') private RestRatingModel: Model<RestRatingClass>,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
  ) {
  }
  /**
   * get rest rating by restId and userUd
   * @returns found number of rating, if not found returns 0
   */
  async getRestRating(
    restId: string,
    userId: string,
  ): Promise<number> {
    let restRatingFromDb = await this.RestRatingModel.findOne({ rest: restId })

    if (!restRatingFromDb) {
      restRatingFromDb = await this.RestRatingModel.create({
        rest: restId,
        ratings: [
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
    }

    // скорее всего, пользоваель поставил оценку 3-5, поэтому лучше начинать искать с 5 звёзд
    for (let rItem of restRatingFromDb.ratings.reverse()) {
      if (rItem.users.includes(userId)) {
        return rItem.rating
      }
    }
    return 0
  }

  async setRestRating(
    rating: number,
    restId: string,
    userId: string,
  ) {
    let restRatingFromDb = await this.RestRatingModel.findOne({ rest: restId })

    if (!restRatingFromDb) {
      restRatingFromDb = await this.RestRatingModel.create({
        rest: restId,
        ratings: [
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
    }

    let foundRestRating = false;
    // запускаем всё в обратном порядке, потому что
    // пользователь, скорее всего, поставил от 3 до 5 и сделал это достаточно недавно
    for (let i = restRatingFromDb.ratings.length - 1; i >= 0; i--) {
      for (let j = restRatingFromDb.ratings[i].users.length - 1; j >= 0; j--) {
        if (restRatingFromDb.ratings[i].users[j] == userId) {
          foundRestRating = true;
          restRatingFromDb.ratings[i].users.splice(j, 1)
          break
        }
      }
      if (foundRestRating) break
    }

    for (let rItem of restRatingFromDb.ratings) {
      if (rItem.rating == rating) {
        rItem.users.push(userId)
        break
      }
    }
    restRatingFromDb.markModified('ratings')

    return await restRatingFromDb.save()
  }
}
