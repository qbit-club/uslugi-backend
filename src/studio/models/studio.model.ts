import { MongooseModule } from "@nestjs/mongoose";
import { StudioSchema } from "../schemas/studio.schema";

let StudioModel = MongooseModule.forFeature([{ name: 'Studio', schema: StudioSchema, collection: 'studios' }])
export default StudioModel