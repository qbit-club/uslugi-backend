import { MongooseModule } from "@nestjs/mongoose";
import { AppStateSchema } from "../schemas/app-state.schema";

let AppStateModel = MongooseModule.forFeature([{ name: 'AppState', schema: AppStateSchema, collection: 'appstate' }])
export default AppStateModel