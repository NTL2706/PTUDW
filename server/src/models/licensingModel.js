import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Licensing = new Schema({
    address: String,
    lon: Number,
    lat: Number,
    type: String,

    typeAds: String,
    height: Number,
    width: Number,
    content: String,
    urlImg: String,

    start_date: Date,
    end_date: Date,

    company: {
        name: String,
        email: String,
        phone: String
    },

    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: false }
}, {
    collection: "Licensing"
})

const licensingModel = mongoose.model("Licensing", Licensing);

export { licensingModel }
export { Licensing }
