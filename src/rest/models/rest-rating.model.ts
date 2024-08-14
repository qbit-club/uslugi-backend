import { MongooseModule } from "@nestjs/mongoose";
import { RestRatingSchema } from "../schemas/rest-rating.schema";

let RestRatingModel = MongooseModule.forFeature([{ name: 'RestRating', schema: RestRatingSchema, collection: 'rest-ratings' }])
export default RestRatingModel