import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: { type: String, },
    password: String,
    role: String
}, {
    collection: "User"
})

const userModel = mongoose.model("User", User);

export { userModel }
export { User }
