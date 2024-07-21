import mongoose from "mongoose"

export interface Role {
    type: string,
    rest_ids: mongoose.Types.ObjectId[]
}
