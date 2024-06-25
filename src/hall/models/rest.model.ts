import { MongooseModule } from "@nestjs/mongoose";
import { RestSchema } from "../schemas/rest.schema";

let RestModel = MongooseModule.forFeature([{ name: 'Rest', schema: RestSchema, collection: 'halls' }])
export default RestModel