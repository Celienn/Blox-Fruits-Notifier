import mongoose , {Schema, model, Document, Model} from "mongoose";

export interface IGuildData extends Document {
    id: string;
    stockChannel?: string;
    stockMessageId?: string;
}

const guildSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    stockChannel: {
        type: String,
        default: "",
        required: false,
    },
    stockMessageId : {
        type: String,
        default: "",
        required: false,
    }
})

export default mongoose.models["GuildData"]
    ? mongoose.models["GuildData"] as Model<IGuildData>
    : model<IGuildData>("GuildData", guildSchema);