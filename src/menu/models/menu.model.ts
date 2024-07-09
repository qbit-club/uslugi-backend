import { MongooseModule } from "@nestjs/mongoose";
import { MenuSchema } from "../schemas/menu.schema";

let MenuModel = MongooseModule.forFeature([{ name: 'Menu', schema: MenuSchema, collection: 'menu' }])
export default MenuModel