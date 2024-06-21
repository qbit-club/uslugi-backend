import { MongooseModule } from "@nestjs/mongoose";
import { HallSchema } from "../schemas/hall.schema";

let HallModel = MongooseModule.forFeature([{ name: 'Hall', schema: HallSchema, collection: 'halls' }])
export default HallModel