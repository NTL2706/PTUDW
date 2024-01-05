import mongoose from "mongoose";

const Schema = mongoose.Schema;
const User = new Schema({
    name: String,
    dayOfBirth: String,
    email: {
        type: String,
    },
    password: String,
    phone: String
}, {
    collection: "User"
})

const userModel = mongoose.model("User", User);

export { userModel }
export { User }
