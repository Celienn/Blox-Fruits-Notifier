import mongoose , {Schema, model, Document, Model} from "mongoose";

export interface IUserData extends Document {
    id: string;
    fruits: string[];
    notify: boolean;
}

const notifySchema = new Schema<IUserData>({
    id: {
        type: String,
        required: true,
    },
    fruits: {
        type: [String],
        default: [],
        required: false,
    },
    notify: {
        type: Boolean,
        default: true,
        required: false,
    }
})

export default mongoose.models["UserData"]
    ? mongoose.models["UserData"] as Model<IUserData>
    : model<IUserData>("UserData", notifySchema);