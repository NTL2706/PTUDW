import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: { type: String, },
    password: String,
    role: String,
    option: {
        "district": {
            type: Schema.Types.ObjectId,
            ref: 'District'
        },
        "ward": {
            type: Schema.Types.ObjectId,
            ref: 'Ward'
        },
    }
}, {
    collection: "User"
})

const userModel = mongoose.model("User", User);

export { userModel }
export { User }
